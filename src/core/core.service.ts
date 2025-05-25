import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID, UUID } from 'crypto';
import { latLngToCell } from 'h3-js';
import { Op } from 'sequelize';
import { RwaziService } from './model/RwaziService.entity';
import { UserFavoriteRwaziService } from './model/UserFavoriteRwaziService.entity';
import { kRingIndexesArea } from './h3Utils';

faker.seed(1);

@Injectable()
export class CoreService {
  constructor(
    @InjectModel(RwaziService) public rwaziServiceModel: typeof RwaziService,
    @InjectModel(UserFavoriteRwaziService)
    public userFavoriteRwaziServiceModel: typeof UserFavoriteRwaziService,
  ) {}

  async seedData() {
    const count = await this.rwaziServiceModel.count();
    if (count) {
      return;
    }

    const TYPES = [
      'supermarket',
      'pharmacy',
      'gasStation',
      'convenienceStore',
      'restaurant',
    ];
    const hanoiNorthBound = 21.056542041172552;
    const hanoiSouthBound = 20.945001890786397;
    const hanoiWestBound = 105.74887257818588;
    const hanoiEastBound = 105.9088609719508;

    const saigonNorthBound = 10.918098651905348;
    const saigonSouthBound = 10.719994981791478;
    const saigonWestBound = 106.54191685284772;
    const saigonEastBound = 106.76401753760148;

    // Fill data for Hanoi
    for (let i = 0; i < 300; i += 1) {
      const lat = faker.number.float({
        max: hanoiNorthBound,
        min: hanoiSouthBound,
      });
      const lon = faker.number.float({
        min: hanoiWestBound,
        max: hanoiEastBound,
      });

      const name = `HN ${faker.company.name()}`;
      const type = TYPES[faker.number.int({ min: 0, max: TYPES.length - 1 })];

      await this.rwaziServiceModel.create({
        id: randomUUID(),
        name,
        type,
        lat,
        lon,
        hexId0: latLngToCell(lat, lon, 0),
        hexId1: latLngToCell(lat, lon, 1),
        hexId2: latLngToCell(lat, lon, 2),
        hexId3: latLngToCell(lat, lon, 3),
        hexId4: latLngToCell(lat, lon, 4),
        hexId5: latLngToCell(lat, lon, 5),
        hexId6: latLngToCell(lat, lon, 6),
        hexId7: latLngToCell(lat, lon, 7),
        hexId8: latLngToCell(lat, lon, 8),
        hexId9: latLngToCell(lat, lon, 9),
        hexId10: latLngToCell(lat, lon, 10),
        hexId11: latLngToCell(lat, lon, 11),
        hexId12: latLngToCell(lat, lon, 12),
        hexId13: latLngToCell(lat, lon, 13),
        hexId14: latLngToCell(lat, lon, 14),
        hexId15: latLngToCell(lat, lon, 15),
      });
    }

    // Fill data for Saigon
    for (let i = 0; i < 300; i += 1) {
      const lat = faker.number.float({
        max: saigonNorthBound,
        min: saigonSouthBound,
      });
      const lon = faker.number.float({
        min: saigonWestBound,
        max: saigonEastBound,
      });

      const name = `SG ${faker.company.name()}`;
      const type = TYPES[faker.number.int({ min: 0, max: TYPES.length - 1 })];

      await this.rwaziServiceModel.create({
        id: randomUUID(),
        name,
        type,
        lat,
        lon,
        hexId0: latLngToCell(lat, lon, 0),
        hexId1: latLngToCell(lat, lon, 1),
        hexId2: latLngToCell(lat, lon, 2),
        hexId3: latLngToCell(lat, lon, 3),
        hexId4: latLngToCell(lat, lon, 4),
        hexId5: latLngToCell(lat, lon, 5),
        hexId6: latLngToCell(lat, lon, 6),
        hexId7: latLngToCell(lat, lon, 7),
        hexId8: latLngToCell(lat, lon, 8),
        hexId9: latLngToCell(lat, lon, 9),
        hexId10: latLngToCell(lat, lon, 10),
        hexId11: latLngToCell(lat, lon, 11),
        hexId12: latLngToCell(lat, lon, 12),
        hexId13: latLngToCell(lat, lon, 13),
        hexId14: latLngToCell(lat, lon, 14),
        hexId15: latLngToCell(lat, lon, 15),
      });
    }
  }

  async search(
    lat: number,
    lon: number,
    searchRadius: number,
    types?: string[],
    name?: string,
  ) {
    const { hexIds, res } = kRingIndexesArea(lat, lon, searchRadius);

    const hexCondition = { [Op.in]: hexIds };
    const hexResCondition =
      res === 0
        ? { hexId0: hexCondition }
        : res === 1
          ? { hexId1: hexCondition }
          : res === 2
            ? { hexId2: hexCondition }
            : res === 3
              ? { hexId3: hexCondition }
              : res === 4
                ? { hexId4: hexCondition }
                : res === 5
                  ? { hexId5: hexCondition }
                  : res === 6
                    ? { hexId6: hexCondition }
                    : res === 7
                      ? { hexId7: hexCondition }
                      : res === 8
                        ? { hexId8: hexCondition }
                        : res === 9
                          ? { hexId9: hexCondition }
                          : res === 10
                            ? { hexId10: hexCondition }
                            : res === 11
                              ? { hexId11: hexCondition }
                              : res === 12
                                ? { hexId12: hexCondition }
                                : res === 13
                                  ? { hexId13: hexCondition }
                                  : res === 14
                                    ? { hexId14: hexCondition }
                                    : { hexId15: hexCondition };

    return await this.rwaziServiceModel.findAll({
      where: {
        [Op.and]: [
          types?.length ? { type: { [Op.in]: types } } : {},
          name ? { name } : {},
          hexResCondition,
        ],
      },
      // logging: console.log,
    });
  }

  async getFavoriteServices(userId: UUID) {
    return this.userFavoriteRwaziServiceModel.findAll({ where: { userId } });
  }

  async createFavoriteService(userId: UUID, serviceId: UUID) {
    await this.userFavoriteRwaziServiceModel.create({
      userId,
      rwaziServiceId: serviceId,
    });
  }

  async deleteFavoriteService(userId: UUID, serviceId: UUID) {
    return await this.userFavoriteRwaziServiceModel.destroy({
      where: { userId, rwaziServiceId: serviceId },
    });
  }
}
