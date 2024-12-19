import '@testing-library/jest-dom';

require('dotenv').config();

if (!global.structuredClone) {
  global.structuredClone = function structuredClone(objectToClone: any) {
    if (objectToClone === undefined) return undefined;
    return JSON.parse(JSON.stringify(objectToClone));
  };
}
