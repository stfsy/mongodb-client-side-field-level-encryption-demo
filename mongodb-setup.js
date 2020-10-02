var ClientSideFieldLevelEncryptionOptions = {
    "keyVaultNamespace": "encryption.__keys",
    "kmsProviders": {
        "local": {
            "key": BinData(0, "oOLUKkg4Lcl4a8WvPe47czhmhOxeprp8SKN6WdACdl+LDpnJjjoTcC/6CtuF/5Vi2idkOZDNMkGHPkV9+9btskrRMHHLEWzBTguItCCf+vtZIUkmVq8wSIHjrotKVi9F")
        }
    }
}

var connection = Mongo(
    "mongodb://localhost:27017/",
    ClientSideFieldLevelEncryptionOptions
)

var keyVault = connection.getKeyVault()
var uuid = keyVault.createKey(
    "local",
    ["www"]
)
