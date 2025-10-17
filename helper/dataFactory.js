import { faker } from "@faker-js/faker";
import { locationData } from "../test_data/locations.json";

/**
 * Combine base JSON + dynamic faker data
 * @param {string} key - key trong file JSON, vd: "taylorLocation"
 */

export function createLocationData(key = baseLocation) {
    const base = locationData[key];
    if (!base) throw new Error(`❌ Không tìm thấy key '${key}' trong locations.json`);
    return {
        ...baseLocation,
        name: `${base.name} ${faker.number.int({ min: 1000, max: 9999 })}`,
        city: faker.location.city(),
        stateProvince: faker.location.state(),
        zipPostalCode: faker.location.zipCode(),
        countryName: faker.location.country(),
        phone: faker.phone.number('##########'),
        fax: faker.phone.number('##########'),
        address: faker.location.streetAddress(),
        notes: `Auto test - ${faker.lorem.sentence()}`

    };

}