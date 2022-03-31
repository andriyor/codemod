import { StringLiteral } from 'ts-morph'

import { throwFromMethodsIfUndefinedReturn } from '@sourcegraph/codemod-common'
import { JsxTagElement } from '@sourcegraph/codemod-toolkit-ts'

import { inputClassNamesMapping, ClassNameMapping } from './inputClassNamesMapping'

interface StringLiteralValidatorResult {
    stringLiteral: StringLiteral
    classNameMappings: ClassNameMapping[]
}

interface JsxTagElementValidatorResult {
    jsxTagElement: JsxTagElement
    tagName: string
}

export const validateCodemodTarget = {
    /**
     * Returns `JsxTagElement`.
     */
    JsxTagElement(jsxTagElement: JsxTagElement, bannedTagName = 'input'): JsxTagElementValidatorResult | void {
        const tagName = jsxTagElement.getTagNameNode().getText()

        if (tagName === bannedTagName) {
            return { jsxTagElement, tagName }
        }
    },

    /**
     * Returns non-void result if received `StringLiteral` has one of icon classes like `icon-inline`.
     */
    StringLiteral(stringLiteral: StringLiteral): StringLiteralValidatorResult | void {
        const classNameMappings = inputClassNamesMapping.filter(({ className }) => {
            return stringLiteral
                .getLiteralValue()
                .split(' ')
                .some(word => {
                    return word === className
                })
        })

        if (classNameMappings.length !== 0) {
            return { classNameMappings, stringLiteral }
        }
    },
}

export const validateCodemodTargetOrThrow = throwFromMethodsIfUndefinedReturn(validateCodemodTarget)
