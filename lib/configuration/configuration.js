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

    getMongoEncryptionKey() {
        return this._env('MONGO_ENCRYPTION_KEY', "oOLUKkg4Lcl4a8WvPe47czhmhOxeprp8SKN6WdACdl+LDpnJjjoTcC/6CtuF/5Vi2idkOZDNMkGHPkV9+9btskrRMHHLEWzBTguItCCf+vtZIUkmVq8wSIHjrotKVi9F")
    }
}