const path = require("path")
const fs = require("fs")
const _ = require("lodash")

/* global process */

const executable = process.argv[1]
const installDir = path.dirname(fs.realpathSync(executable))

const enumsFile = path.join(installDir, "data", "enums.json")
const enumNamesFile = path.join(installDir, "data", "enum-names.txt")
const originalEnumsFile = path.join(installDir, "data", "original-enums.json")
const originalEnumNamesFile = path.join(installDir, "data", "original-enum-names.txt")
const enumIdsFile = path.join(installDir, "data", "enum-ids.txt")
const translationsFile = path.join(installDir, "data", "translations.json")

function getTranslations() {
    return JSON.parse(fs.readFileSync(translationsFile, { encoding: "utf8" }))
}

function addIdAndNameToSet(set, key) {
    const [name, id] = key.split(".")
    return { ...set, id, name, key }
}

function getEnumNamesAndIds(useOriginal) {

    const enumNamesFileToRead = useOriginal ? originalEnumNamesFile : enumNamesFile

    const enumNames = fs.readFileSync(enumNamesFileToRead, { encoding: "utf8" })
    const enumIds = fs.readFileSync(enumIdsFile, { encoding: "utf8" })
    return { enumNames, enumIds }
}

function getEnums(useOriginal) {

    const enumsFileToRead = useOriginal ? originalEnumsFile : enumsFile

    const enumsByKey = JSON.parse(fs.readFileSync(enumsFileToRead, { encoding: "utf8" }))

    const enumsByName = _.chain(enumsByKey)
        .mapValues(addIdAndNameToSet)
        .mapKeys(set => set.name)
        .value()

    const enumsById = _.mapKeys(enumsByName, set => set.id)

    return { enumsByName, enumsById }
}

module.exports = { getTranslations, getEnums, getEnumNamesAndIds }