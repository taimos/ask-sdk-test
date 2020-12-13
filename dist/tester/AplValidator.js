"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AplValidator = void 0;
const assert_1 = require("assert");
const chai_1 = require("chai");
const types_1 = require("../types");
class AplValidator extends types_1.ResponseValidator {
    validate(currentItem, response) {
        if (currentItem.renderDocument) {
            if (!response.response.directives) {
                assert_1.fail('the response did not contain any directives');
            }
            const renderedDocument = response.response.directives.find((value) => value.type === 'Alexa.Presentation.APL.RenderDocument' || value.type === 'Alexa.Presentation.APLA.RenderDocument');
            if (!renderedDocument) {
                assert_1.fail('the response dit not contain a render directive');
            }
            const renderConfig = currentItem.renderDocument;
            if (renderConfig.token) {
                chai_1.expect(renderConfig.token).to.be.equal(renderConfig.token, 'token did not match');
            }
            if (renderConfig.document) {
                if (!renderConfig.document(renderedDocument.document)) {
                    assert_1.fail(`document validation failed. Value was: ${JSON.stringify(renderedDocument.document)}`);
                }
            }
            if (renderConfig.hasDataSources) {
                for (const att in renderConfig.hasDataSources) {
                    if (renderConfig.hasDataSources.hasOwnProperty(att)) {
                        const func = renderConfig.hasDataSources[att];
                        const datasource = renderedDocument.datasources[att];
                        if (!func(datasource)) {
                            assert_1.fail(`The datasource ${att} did not contain the correct value. Value was: ${JSON.stringify(datasource)}`);
                        }
                    }
                }
            }
        }
    }
}
exports.AplValidator = AplValidator;
//# sourceMappingURL=AplValidator.js.map