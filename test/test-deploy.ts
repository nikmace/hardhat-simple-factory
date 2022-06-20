import { assert, expect } from 'chai';
import { ethers } from 'hardhat';
// Types
import { Contract, ContractFactory } from 'ethers';

describe('SimpleStorage', function () {
  let SimpleStorageFC: ContractFactory;
  let simpleStorage: Contract;

  beforeEach(async () => {
    SimpleStorageFC = await ethers.getContractFactory('SimpleStorage');
    simpleStorage = await SimpleStorageFC.deploy();
  });

  it('Should start with a favorite number of 0', async () => {
    const currentValue = await simpleStorage.retrieve();

    expect(currentValue).to.equal(0);
  });

  it('Should update when we call store', async () => {
    const expectedValue = '42';
    const txResponse = await simpleStorage.store(expectedValue);
    await txResponse.wait(1);

    const currentValue = await simpleStorage.retrieve();

    expect(currentValue).to.eq(expectedValue);
  });

  it('Should add person to people list', async () => {
    const expectedName = 'John';
    const expectedNumber = '42';
    const storeRes = await simpleStorage.store(expectedNumber);
    await storeRes.wait(1);

    const txResponse = await simpleStorage.addPerson(expectedName, 42);
    await txResponse.wait(1);

    const { favoriteNumber, name } = await simpleStorage.people(0);

    expect(name).to.eq(expectedName);
    expect(favoriteNumber).to.eq(expectedNumber);
  });

  it('Should return uin256 when calling mapping', async () => {
    const expectedName = 'John';
    const expectedNumber = '42';
    const storeRes = await simpleStorage.store(expectedNumber);
    await storeRes.wait(1);

    const txResponse = await simpleStorage.addPerson(expectedName, 42);
    await txResponse.wait(1);

    const { favoriteNumber, name } = await simpleStorage.people(0);

    const favNumber = await simpleStorage.nameToFavoriteNumber(name);

    assert.equal(favNumber, expectedNumber);
  });
});
