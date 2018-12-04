"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const chai_1 = require("chai");
const types_1 = require("../types");
class CardValidator extends types_1.ResponseValidator {
    validate(currentItem, response) {
        /*

    hasCardTitle? : string;
    hasCardContent? : string;
    hasCardContentLike? : string;
    hasCardText? : string;
    hasCardTextLike? : string;
    hasSmallImageUrlLike? : string;
    hasLargeImageUrlLike? : string;
         */
        if (currentItem.hasCardTitle) {
            if (!response.response.card || (response.response.card.type !== 'Simple' && response.response.card.type !== 'Standard')) {
                assert_1.fail('the response did not contain a card');
            }
            else {
                chai_1.expect(response.response.card.title).to.be.equal(currentItem.hasCardTitle);
            }
        }
        if (currentItem.hasCardContent) {
            if (!response.response.card) {
                assert_1.fail('the response did not contain a card');
            }
            else if (response.response.card.type !== 'Simple') {
                assert_1.fail('the card in the response was not a simple card');
            }
            else {
                chai_1.expect(response.response.card.content).to.be.equal(currentItem.hasCardContent);
            }
        }
        if (currentItem.hasCardContentLike) {
            if (!response.response.card) {
                assert_1.fail('the response did not contain a card');
            }
            else if (response.response.card.type !== 'Simple') {
                assert_1.fail('the card in the response was not a simple card');
            }
            else {
                chai_1.expect(response.response.card.content.indexOf(currentItem.hasCardContentLike) >= 0, 'Card content did not contain specified text').to.be.true;
            }
        }
        if (currentItem.hasCardText) {
            if (!response.response.card) {
                assert_1.fail('the response did not contain a card');
            }
            else if (response.response.card.type !== 'Standard') {
                assert_1.fail('the card in the response was not a standard card');
            }
            else {
                chai_1.expect(response.response.card.text).to.be.equal(currentItem.hasCardText);
            }
        }
        if (currentItem.hasCardTextLike) {
            if (!response.response.card) {
                assert_1.fail('the response did not contain a card');
            }
            else if (response.response.card.type !== 'Standard') {
                assert_1.fail('the card in the response was not a simple card');
            }
            else {
                chai_1.expect(response.response.card.text.indexOf(currentItem.hasCardTextLike) >= 0, 'Card text did not contain specified text').to.be.true;
            }
        }
        if (currentItem.hasSmallImageUrlLike) {
            if (!response.response.card) {
                assert_1.fail('the response did not contain a card');
            }
            else if (response.response.card.type !== 'Standard') {
                assert_1.fail('the card in the response was not a simple card');
            }
            else if (!response.response.card.image) {
                assert_1.fail('the card in the response did not contain an image');
            }
            else {
                chai_1.expect(response.response.card.image.smallImageUrl.indexOf(currentItem.hasSmallImageUrlLike) >= 0, 'Card small image did not contain specified URL').to.be.true;
            }
        }
        if (currentItem.hasLargeImageUrlLike) {
            if (!response.response.card) {
                assert_1.fail('the response did not contain a card');
            }
            else if (response.response.card.type !== 'Standard') {
                assert_1.fail('the card in the response was not a simple card');
            }
            else if (!response.response.card.image) {
                assert_1.fail('the card in the response did not contain an image');
            }
            else {
                chai_1.expect(response.response.card.image.largeImageUrl.indexOf(currentItem.hasLargeImageUrlLike) >= 0, 'Card large image did not contain specified URL').to.be.true;
            }
        }
    }
}
exports.CardValidator = CardValidator;
//# sourceMappingURL=CardValidator.js.map