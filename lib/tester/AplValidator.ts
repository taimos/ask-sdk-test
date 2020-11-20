/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { interfaces, ResponseEnvelope } from 'ask-sdk-model';
import { fail } from 'assert';
import { expect } from 'chai';
import { ResponseValidator, SequenceItem } from '../types';

export class AplValidator extends ResponseValidator {
    public validate(currentItem : SequenceItem, response : ResponseEnvelope) : void {
        if (currentItem.renderDocument) {
            if (!response.response.directives) {
                fail('the response did not contain any directives');
            }
            const renderedDocument = <interfaces.alexa.presentation.apl.RenderDocumentDirective> response.response.directives.find((value) => value.type === 'Alexa.Presentation.APL.RenderDocument' || value.type === 'Alexa.Presentation.APLA.RenderDocument');
            if (!renderedDocument) {
                fail('the response did not contain a render directive');
            }

            const renderConfig = currentItem.renderDocument;
            if (renderConfig.token) {
                expect(renderConfig.token).to.be.equal(renderConfig.token, 'token did not match');
            }
            if (renderConfig.document) {
                if (!renderConfig.document(renderedDocument.document)) {
                    fail(`document validation failed. Value was: ${JSON.stringify(renderedDocument.document)}`);
                }
            }
            if (renderConfig.hasDataSources) {
                for (const att in renderConfig.hasDataSources) {
                    if (renderConfig.hasDataSources.hasOwnProperty(att)) {
                        const func = renderConfig.hasDataSources[att];
                        const datasource = renderedDocument.datasources[att];
                        if (!func(datasource)) {
                            fail(`The datasource ${att} did not contain the correct value. Value was: ${JSON.stringify(datasource)}`);
                        }
                    }
                }
            }
        }
    }

}
