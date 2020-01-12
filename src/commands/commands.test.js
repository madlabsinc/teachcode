const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire').noCallThru();

const fs = require('fs');

test.serial('no config file', async t => {
  const showcommands = proxyquire('./commands', {
    'node-banner': sinon.stub().resolves('resolves'),
  });

  const fsExistsSyncStub = sinon.stub(fs, 'existsSync').returns(false);
  const processExitSpy = sinon.spy(process, 'exit');

  await showcommands();

  t.assert(fsExistsSyncStub.calledOnce);
  t.assert(processExitSpy.withArgs(1).calledOnce);
  sinon.restore();
});

test.todo('config file present');
