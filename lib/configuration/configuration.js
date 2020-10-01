'use strict'

module.exports = new class {

    _env(name, defaultValue) {
        const envVariable = process.env[name]

        if (envVariable === undefined) {
            return defaultValue
        } else {
            return envVariable
        }
    }

    _joinIfSecondNotFalsy(first, second) {
        if (second) {
            return first + second
        } else {
            return ""
        }
    }

    getMongoDbHostAndPort() {
        return this._env('MONGO_HOST', 'localhost') + ':' + this._env('MONGO_PORT', '27017')
    }

    getMongoDbParams() {
        return ''
    }

    getMongoDbUrl() {
        return "mongodb://" + this.getMongoDbHostAndPort() + '/blauspecht' + this.getMongoDbParams()
    }

    getMongoDbName() {
        return "encryption-test"
    }
}