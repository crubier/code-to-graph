import * as Sentry from "@sentry/node";
Sentry.init({
  dsn: "https://266778fcad134254a9ef666bb4f03c7d@sentry.io/1285601"
});

import Promise from "bluebird";
import {
  updateImageValidityWrapper,
  updateImagePositionWrapper,
  getOrganizationByUserWrapper
} from "./querysLocatorDb";
import { isNil, map, find } from "lodash/fp";
import { getImageData } from "./image";
import { findClosestStructures } from "./structure";
import { createScene, doesIntersect } from "./scene";
import fs from "fs-extra";
import { invokeLambda } from "../../../../connectors/lambdas";
import { query } from "../../../../connectors/apollo";
import { writeJsonFile } from "../../../../connectors/json";

import getListImagesByFilterQuery from "./graphql/getListImageByFilter.graphql";
import countListImagesByFilterQuery from "./graphql/countListImageByFilter.graphql";

const getListImagesByFilter = query(getListImagesByFilterQuery);
const countListImagesByFilter = query(countListImagesByFilterQuery);

type inputOptionsType = {
  imageId: string, //could be mission or image Id
  userId: string,
  logging: boolean,
  imageRecallage: boolean,
  rayCast: boolean,
  saveScene: boolean,
  updateDataBase: boolean
};

const main = async (inputOptions: inputOptionsType) => {
  try {
    const image = await getImageData(inputOptions);
    const closestStructures = await findClosestStructures(
      image,
      inputOptions.userId,
      30
    );
    if (closestStructures.status != 200) {
      return closestStructures;
    }

    image.closestStructure = closestStructures.body[0];
    console.log(`INFO: closest structure Id: ${image.closestStructure.id}`);
    console.log(`INFO: closest structure Name: ${image.closestStructure.name}`);
    console.log(
      `INFO: closest structure Altitude: ${
        image.closestStructure.location.altitude
      }`
    );
    console.log(
      `INFO: closest structure Latitude: ${
        image.closestStructure.location.latitude
      }`
    );
    console.log(
      `INFO: closest structure Longitude: ${
        image.closestStructure.location.longitude
      }`
    );
    console.log(
      `INFO: closest structure params: ${JSON.stringify(
        image.closestStructure.parameters,
        null,
        2
      )} `
    );

    if (isNil(image.mission.altitudeOffset) || !inputOptions.scene3D) {
      console.log(`INFO: using scene 2D`);
      image.location.altitude = image.closestStructure.altitude;
      image.location.pitch = 0;
      map(structure => {
        structure.altitude = image.closestStructure.altitude;
      }, closestStructures.body);
      console.log(
        `INFO: updating image and all structures altitude to ${
          image.closestStructure.altitude
        }`
      );
    }
    const geoOrigin = [
      image.closestStructure.latitude,
      image.closestStructure.longitude,
      image.closestStructure.altitude
    ];
    const scene = await createScene({
      images: [image],
      structures: closestStructures.body,
      geoOrigin: geoOrigin,
      buffer: inputOptions.structureBuffer,
      cameraOptions: {
        near: 0.5,
        far: 30
      }
    });
    if (inputOptions.saveScene) {
      await writeJsonFile(`${image.id}_locatorScene.json`, scene.toJSON());
    }
    let intersection = find(structure => {
      return doesIntersect(scene, image.id, structure.id);
    }, closestStructures.body);
    if (isNil(intersection)) {
      console.log("INFO: FOUND NO INTERSECTION FOR THE IMAGE !!");
      console.log("INFO: USING CLOSEST STRUCTURE TO THE IMAGE !!");
      intersection = image.closestStructure;
    } else {
      console.log(
        `INFO: Found intersection with structure name ${
          intersection.name
        } and structure id ${intersection.id}`
      );
    }
    if (inputOptions.updateDataBase) {
      let resultPosition = {};
      if (isNil(image.mission)) {
        image.mission = intersection.mission;
      }
      const resultValidity = await updateImageValidityWrapper({
        imageId: image.id,
        missionExecutionId: {
          connect: { id: image.mission.id }
        },
        structureIds: {
          connect: [{ id: intersection.id }]
        }
      });
      console.log(
        `INFO: updated ${image.id} with missionExecution ${
          image.mission.id
        } and structure ${intersection.name} with id ${intersection.id}`
      );
      if (intersection.model.type == "HighVoltagePowerLinePylon") {
        const position = {
          height: image.location.altitude - intersection.altitude,
          angleToPylonOrientation: Math.PI - image.location.yaw
        };
        resultPosition = await updateImagePositionWrapper(
          image.location.id,
          position
        );
        {
          console.log(
            `INFO: Image Position % HTB ${JSON.stringify(position, null, 2)}`
          );
        }
      }
      return { ...resultValidity, ...resultPosition };
    } else {
      return { status: 200, body: `intersection is ${intersection.id}` };
    }
  } catch (e) {
    console.log(e);
  }
};

export const handler = async (event, context, callback) => {
  let imageId = event.imageId;
  let userId = event.userId;
  if (isNil(imageId)) {
    imageId = event.body.imageId;
    userId = event.body.userId;
  }

  console.log(`IMAGEID :: ${imageId}`);
  console.log(`USERID :: ${userId}`);
  const result = await main({
    imageId: imageId,
    userId: userId,
    scene3D: true,
    structureBuffer: 5,
    saveScene: false,
    updateDataBase: true
  });
  // const orgas = await getOrganizationByUserWrapper(userId);
  // const funcName = process.env.IMAGE_INSPECTOR;
  // console.log("image inspector name", funcName);
  // await Promise.map(
  //   orgas,
  //   async orga => {
  //     try {
  //       console.log("running inspector for", orga.name);
  //       const res = await invokeLambda(funcName)({
  //         imageId: imageId,
  //         organizationId: orga.id
  //       });
  //       console.log(res);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   },
  //   { concurrency: 20 }
  // );

  callback(null, result);
};

const run = async () => {
  const userId = "cjod5xngh0s060170t1bss74x";
  const filter = {
    structures_some: { id: "cjik2b2pnkb5z01092b20912p" },
    mission: { mission: { id: "cjpjtczrn43on0c3229h75thl" } },
    file: { id_not: null }
  };

  const imageList = await getListImagesByFilter({
    filter: filter
  });
  console.log(`got ${imageList.images.length} images`);
  const funcName = `image-pipeline-${process.env.STAGE}-locatorHandler`;
  console.log("Using ", funcName);
  await Promise.map(
    imageList.images,
    async image => {
      try {
        const res = await handler(
          {
            imageId: image.id,
            userId: userId
          },
          null,
          function(aes, res) {
            console.log(res);
          }
        );
        // const res = await invokeLambda(funcName)({
        //   imageId: image.id,
        //   userId: userId
        // });
        // if (res.StatusCode == 200) {
        //   const result = JSON.parse(res.Payload);
        //   console.log(
        //     "SUCCESS :: image:",
        //     image.id,
        //     "vaildity",
        //     result[0].valid
        //   );
        // } else {
        //   console.log("ERROR :: image:", image.id);
        // }
      } catch (e) {
        console.log(e);
      }
    },
    { concurrency: 3 }
  );
};

if (require.main === module) {
  // run();
  handler(
    {
      imageId: "cjpo38p72m25j0c32chygfxod",
      userId: "cjod5xngh0s060170t1bss74x"
    },
    null,
    function(aes, res) {
      console.log(res);
    }
  );
}
