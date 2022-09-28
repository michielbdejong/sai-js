import { DataFactory } from 'n3';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest-rdf';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fetch } from '@janeirodigital/interop-test-utils';
import { INTEROP, ACL } from '@janeirodigital/interop-namespaces';
import { randomUUID } from 'crypto';
import { AuthorizationAgentFactory, AccessAuthorizationData } from '../../src';

const webId = 'https://alice.example/#id';
const agentId = 'https://jarvis.alice.example/#agent';

test('should set data and store', async () => {
  const factory = new AuthorizationAgentFactory(webId, agentId, { fetch, randomUUID });
  const dataAuthorizationIri = 'https://auth.alice.example/25b18e05-7f75-4e13-94f6-9950a67a89dd';
  const dataAuthorization = factory.immutable.dataAuthorization(dataAuthorizationIri, {
    grantee: 'https://projectron.example/#app',
    grantedBy: webId,
    registeredShapeTree: 'https://solidshapes.example/trees/Project',
    accessMode: [ACL.Read.value, ACL.Write.value],
    scopeOfAuthorization: INTEROP.All.value
  });
  const accessAuthorizationData = {
    grantedBy: webId,
    grantedWith: agentId,
    grantee: 'https://projectron.example/#app',
    hasAccessNeedGroup: 'https://projectron.example/#some-access-group',
    dataAuthorizations: [dataAuthorization]
  };
  const accessAuthorizationIri = 'https://auth.alice.example/e791fa95-9363-4852-a9ed-e266aa62c193';
  const accessAuthorizationQuads = [
    DataFactory.quad(
      DataFactory.namedNode(accessAuthorizationIri),
      INTEROP.hasDataAuthorization,
      DataFactory.namedNode(dataAuthorization.iri)
    )
  ];
  const props: (keyof AccessAuthorizationData)[] = ['grantedBy', 'grantedWith', 'grantee', 'hasAccessNeedGroup'];
  for (const prop of props) {
    accessAuthorizationQuads.push(
      DataFactory.quad(
        DataFactory.namedNode(accessAuthorizationIri),
        INTEROP[prop],
        DataFactory.namedNode(accessAuthorizationData[prop] as string)
      )
    );
  }
  const accessAuthorization = factory.immutable.accessAuthorization(accessAuthorizationIri, accessAuthorizationData);
  expect(accessAuthorization.dataset).toBeRdfDatasetContaining(...accessAuthorizationQuads);

  const dataAuthorizationPutSpy = jest.spyOn(dataAuthorization, 'put');
  const accessAuthorizationPutSpy = jest.spyOn(accessAuthorization, 'put');
  // @ts-ignore
  accessAuthorization.factory = { readable: { accessAuthorization: jest.fn() } };

  await accessAuthorization.store();
  expect(dataAuthorizationPutSpy).toBeCalled();
  expect(accessAuthorizationPutSpy).toBeCalled();
  expect(accessAuthorization.factory.readable.accessAuthorization).toBeCalledWith(accessAuthorizationIri);
});
