const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire').noCallThru();

const chalk = require('chalk');
const fs = require('fs');

const showKeys = proxyquire('../../src/commands/keys', {
  'node-banner': sinon.stub().resolves('ok'),
});

sinon.stub(console, 'log');

// stubs for chalk to return plain text
const chalkColours = ['red', 'magentaBright', 'green'];
for (let colour of chalkColours) {
  sinon.stub(chalk, colour).returnsArg(0);
}

const processExitStub = sinon.stub(process, 'exit').returns(0);

const configWithoutKeys = {
  userName: 'configWithoutKeys',
  taskCount: 0,
  keys: [],
};

const configWithMultipleKeys = {
  userName: 'configWithMultipleKeys',
  taskCount: 2,
  keys: ['testkey1', 'testkey2'],
};

test('no config file', async t => {
  const fsExistsSyncStub = sinon.stub(fs, 'existsSync').returns(false);

  await showKeys();

  t.assert(fsExistsSyncStub.calledOnce);
  t.assert(processExitStub.withArgs(1).calledOnce);

  sinon.restore();
});

test('no keys present', async t => {
  const fsExistsSyncStub = sinon.stub(fs, 'existsSync').returns(true);
  const fsReadFileSyncStub = sinon
    .stub(fs, 'readFileSync')
    .returns(Buffer(JSON.stringify(configWithoutKeys), 'utf-8'));

  await showKeys();

  t.assert(fsExistsSyncStub.calledOnce);
  t.assert(fsReadFileSyncStub.calledOnce);

  sinon.restore();
});

test('multiple keys present', async t => {
  const fsExistsSyncStub = sinon.stub(fs, 'existsSync').returns(true);
  const fsReadFileSyncStub = sinon
    .stub(fs, 'readFileSync')
    .returns(Buffer(JSON.stringify(configWithMultipleKeys), 'utf-8'));

  await showKeys();

  t.assert(fsExistsSyncStub.calledOnce);
  t.assert(fsReadFileSyncStub.calledOnce);

  sinon.restore();
});
