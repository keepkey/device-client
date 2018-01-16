module.exports = require("protobufjs").newBuilder({})['import']({
    "package": null,
    "options": {
        "java_package": "com.keepkey.deviceprotocol",
        "java_outer_classname": "KeepKeyMessage"
    },
    "messages": [
        {
            "name": "ExchangeAddress",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "coin_type",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "address",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "dest_tag",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "rs_address",
                    "id": 4
                }
            ]
        },
        {
            "name": "ExchangeResponseV2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "ExchangeAddress",
                    "name": "deposit_address",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "deposit_amount",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "expiration",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "quoted_rate",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "ExchangeAddress",
                    "name": "withdrawal_address",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "withdrawal_amount",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "ExchangeAddress",
                    "name": "return_address",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "api_key",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "miner_fee",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "order_id",
                    "id": 10
                }
            ]
        },
        {
            "name": "SignedExchangeResponse",
            "fields": [
                {
                    "rule": "optional",
                    "type": "ExchangeResponse",
                    "name": "response",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "signature",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "ExchangeResponseV2",
                    "name": "responseV2",
                    "id": 3
                }
            ]
        },
        {
            "name": "ExchangeResponse",
            "fields": [
                {
                    "rule": "optional",
                    "type": "ExchangeAddress",
                    "name": "deposit_address",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "deposit_amount",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "expiration",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "quoted_rate",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "ExchangeAddress",
                    "name": "withdrawal_address",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "withdrawal_amount",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "ExchangeAddress",
                    "name": "return_address",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "api_key",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "miner_fee",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "order_id",
                    "id": 10
                }
            ]
        },
        {
            "name": "HDNodeType",
            "fields": [
                {
                    "rule": "required",
                    "type": "uint32",
                    "name": "depth",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "uint32",
                    "name": "fingerprint",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "uint32",
                    "name": "child_num",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "chain_code",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "private_key",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "public_key",
                    "id": 6
                }
            ]
        },
        {
            "name": "HDNodePathType",
            "fields": [
                {
                    "rule": "required",
                    "type": "HDNodeType",
                    "name": "node",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "address_n",
                    "id": 2
                }
            ]
        },
        {
            "name": "CoinType",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "coin_name",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "coin_shortcut",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "address_type",
                    "id": 3,
                    "options": {
                        "default": 0
                    }
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "maxfee_kb",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "address_type_p2sh",
                    "id": 5,
                    "options": {
                        "default": 5
                    }
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "address_type_p2wpkh",
                    "id": 6,
                    "options": {
                        "default": 6
                    }
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "address_type_p2wsh",
                    "id": 7,
                    "options": {
                        "default": 10
                    }
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "signed_message_header",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "bip44_account_path",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "forkid",
                    "id": 12
                }
            ]
        },
        {
            "name": "MultisigRedeemScriptType",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "HDNodePathType",
                    "name": "pubkeys",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "bytes",
                    "name": "signatures",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "m",
                    "id": 3
                }
            ]
        },
        {
            "name": "TxInputType",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "address_n",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "prev_hash",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "uint32",
                    "name": "prev_index",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "script_sig",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "sequence",
                    "id": 5,
                    "options": {
                        "default": 4294967295
                    }
                },
                {
                    "rule": "optional",
                    "type": "InputScriptType",
                    "name": "script_type",
                    "id": 6,
                    "options": {
                        "default": "SPENDADDRESS"
                    }
                },
                {
                    "rule": "optional",
                    "type": "MultisigRedeemScriptType",
                    "name": "multisig",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "amount",
                    "id": 8
                }
            ]
        },
        {
            "name": "TxOutputType",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "address",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "address_n",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "uint64",
                    "name": "amount",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "OutputScriptType",
                    "name": "script_type",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "MultisigRedeemScriptType",
                    "name": "multisig",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "op_return_data",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "OutputAddressType",
                    "name": "address_type",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "ExchangeType",
                    "name": "exchange_type",
                    "id": 8
                }
            ]
        },
        {
            "name": "TxOutputBinType",
            "fields": [
                {
                    "rule": "required",
                    "type": "uint64",
                    "name": "amount",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "script_pubkey",
                    "id": 2
                }
            ]
        },
        {
            "name": "TransactionType",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "version",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "TxInputType",
                    "name": "inputs",
                    "id": 2
                },
                {
                    "rule": "repeated",
                    "type": "TxOutputBinType",
                    "name": "bin_outputs",
                    "id": 3
                },
                {
                    "rule": "repeated",
                    "type": "TxOutputType",
                    "name": "outputs",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "lock_time",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "inputs_cnt",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "outputs_cnt",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "extra_data",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "extra_data_len",
                    "id": 9
                }
            ]
        },
        {
            "name": "RawTransactionType",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "payload",
                    "id": 1
                }
            ]
        },
        {
            "name": "TxRequestDetailsType",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "request_index",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "tx_hash",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "extra_data_len",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "extra_data_offset",
                    "id": 4
                }
            ]
        },
        {
            "name": "TxRequestSerializedType",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "signature_index",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "signature",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "serialized_tx",
                    "id": 3
                }
            ]
        },
        {
            "name": "IdentityType",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "proto",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "user",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "host",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "port",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "path",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "index",
                    "id": 6,
                    "options": {
                        "default": 0
                    }
                }
            ]
        },
        {
            "name": "PolicyType",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "policy_name",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "enabled",
                    "id": 2
                }
            ]
        },
        {
            "name": "ExchangeType",
            "fields": [
                {
                    "rule": "optional",
                    "type": "SignedExchangeResponse",
                    "name": "signed_exchange_response",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "withdrawal_coin_name",
                    "id": 2,
                    "options": {
                        "default": "Bitcoin"
                    }
                },
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "withdrawal_address_n",
                    "id": 3
                },
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "return_address_n",
                    "id": 4
                }
            ]
        },
        {
            "name": "Initialize",
            "fields": []
        },
        {
            "name": "GetFeatures",
            "fields": []
        },
        {
            "name": "Features",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "vendor",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "major_version",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "minor_version",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "patch_version",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "bootloader_mode",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "device_id",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "pin_protection",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "passphrase_protection",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "language",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "label",
                    "id": 10
                },
                {
                    "rule": "repeated",
                    "type": "CoinType",
                    "name": "coins",
                    "id": 11
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "initialized",
                    "id": 12
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "revision",
                    "id": 13
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "bootloader_hash",
                    "id": 14
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "imported",
                    "id": 15
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "pin_cached",
                    "id": 16
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "passphrase_cached",
                    "id": 17
                },
                {
                    "rule": "repeated",
                    "type": "PolicyType",
                    "name": "policies",
                    "id": 18
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "model",
                    "id": 21
                }
            ]
        },
        {
            "name": "ClearSession",
            "fields": []
        },
        {
            "name": "ApplySettings",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "language",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "label",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "use_passphrase",
                    "id": 3
                }
            ]
        },
        {
            "name": "ChangePin",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "remove",
                    "id": 1
                }
            ]
        },
        {
            "name": "Ping",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "message",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "button_protection",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "pin_protection",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "passphrase_protection",
                    "id": 4
                }
            ]
        },
        {
            "name": "Success",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "message",
                    "id": 1
                }
            ]
        },
        {
            "name": "Failure",
            "fields": [
                {
                    "rule": "optional",
                    "type": "FailureType",
                    "name": "code",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "message",
                    "id": 2
                }
            ]
        },
        {
            "name": "ButtonRequest",
            "fields": [
                {
                    "rule": "optional",
                    "type": "ButtonRequestType",
                    "name": "code",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "data",
                    "id": 2
                }
            ]
        },
        {
            "name": "ButtonAck",
            "fields": []
        },
        {
            "name": "PinMatrixRequest",
            "fields": [
                {
                    "rule": "optional",
                    "type": "PinMatrixRequestType",
                    "name": "type",
                    "id": 1
                }
            ]
        },
        {
            "name": "PinMatrixAck",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "pin",
                    "id": 1
                }
            ]
        },
        {
            "name": "Cancel",
            "fields": []
        },
        {
            "name": "PassphraseRequest",
            "fields": []
        },
        {
            "name": "PassphraseAck",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "passphrase",
                    "id": 1
                }
            ]
        },
        {
            "name": "GetEntropy",
            "fields": [
                {
                    "rule": "required",
                    "type": "uint32",
                    "name": "size",
                    "id": 1
                }
            ]
        },
        {
            "name": "Entropy",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "entropy",
                    "id": 1
                }
            ]
        },
        {
            "name": "GetPublicKey",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "address_n",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ecdsa_curve_name",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "show_display",
                    "id": 3
                }
            ]
        },
        {
            "name": "PublicKey",
            "fields": [
                {
                    "rule": "required",
                    "type": "HDNodeType",
                    "name": "node",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "xpub",
                    "id": 2
                }
            ]
        },
        {
            "name": "GetAddress",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "address_n",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "coin_name",
                    "id": 2,
                    "options": {
                        "default": "Bitcoin"
                    }
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "show_display",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "MultisigRedeemScriptType",
                    "name": "multisig",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "InputScriptType",
                    "name": "script_type",
                    "id": 5,
                    "options": {
                        "default": "SPENDADDRESS"
                    }
                }
            ]
        },
        {
            "name": "EthereumGetAddress",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "address_n",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "show_display",
                    "id": 2
                }
            ]
        },
        {
            "name": "Address",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "address",
                    "id": 1
                }
            ]
        },
        {
            "name": "EthereumAddress",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "address",
                    "id": 1
                }
            ]
        },
        {
            "name": "WipeDevice",
            "fields": []
        },
        {
            "name": "LoadDevice",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mnemonic",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "HDNodeType",
                    "name": "node",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "pin",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "passphrase_protection",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "language",
                    "id": 5,
                    "options": {
                        "default": "english"
                    }
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "label",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "skip_checksum",
                    "id": 7
                }
            ]
        },
        {
            "name": "ResetDevice",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "display_random",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "strength",
                    "id": 2,
                    "options": {
                        "default": 256
                    }
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "passphrase_protection",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "pin_protection",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "language",
                    "id": 5,
                    "options": {
                        "default": "english"
                    }
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "label",
                    "id": 6
                }
            ]
        },
        {
            "name": "EntropyRequest",
            "fields": []
        },
        {
            "name": "EntropyAck",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "entropy",
                    "id": 1
                }
            ]
        },
        {
            "name": "RecoveryDevice",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "word_count",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "passphrase_protection",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "pin_protection",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "language",
                    "id": 4,
                    "options": {
                        "default": "english"
                    }
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "label",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "enforce_wordlist",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "use_character_cipher",
                    "id": 7
                }
            ]
        },
        {
            "name": "WordRequest",
            "fields": []
        },
        {
            "name": "WordAck",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "word",
                    "id": 1
                }
            ]
        },
        {
            "name": "CharacterRequest",
            "fields": [
                {
                    "rule": "required",
                    "type": "uint32",
                    "name": "word_pos",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "uint32",
                    "name": "character_pos",
                    "id": 2
                }
            ]
        },
        {
            "name": "CharacterAck",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "character",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "delete",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "done",
                    "id": 3
                }
            ]
        },
        {
            "name": "SignMessage",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "address_n",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "message",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "coin_name",
                    "id": 3,
                    "options": {
                        "default": "Bitcoin"
                    }
                }
            ]
        },
        {
            "name": "VerifyMessage",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "address",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "signature",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "message",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "coin_name",
                    "id": 4,
                    "options": {
                        "default": "Bitcoin"
                    }
                }
            ]
        },
        {
            "name": "MessageSignature",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "address",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "signature",
                    "id": 2
                }
            ]
        },
        {
            "name": "EncryptMessage",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "pubkey",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "message",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "display_only",
                    "id": 3
                },
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "address_n",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "coin_name",
                    "id": 5,
                    "options": {
                        "default": "Bitcoin"
                    }
                }
            ]
        },
        {
            "name": "EncryptedMessage",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "nonce",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "message",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "hmac",
                    "id": 3
                }
            ]
        },
        {
            "name": "DecryptMessage",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "address_n",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "nonce",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "message",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "hmac",
                    "id": 4
                }
            ]
        },
        {
            "name": "DecryptedMessage",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "message",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "address",
                    "id": 2
                }
            ]
        },
        {
            "name": "CipherKeyValue",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "address_n",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "key",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "value",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "encrypt",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "ask_on_encrypt",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "ask_on_decrypt",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "iv",
                    "id": 7
                }
            ]
        },
        {
            "name": "CipheredKeyValue",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "value",
                    "id": 1
                }
            ]
        },
        {
            "name": "EstimateTxSize",
            "fields": [
                {
                    "rule": "required",
                    "type": "uint32",
                    "name": "outputs_count",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "uint32",
                    "name": "inputs_count",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "coin_name",
                    "id": 3,
                    "options": {
                        "default": "Bitcoin"
                    }
                }
            ]
        },
        {
            "name": "TxSize",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "tx_size",
                    "id": 1
                }
            ]
        },
        {
            "name": "SignTx",
            "fields": [
                {
                    "rule": "required",
                    "type": "uint32",
                    "name": "outputs_count",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "uint32",
                    "name": "inputs_count",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "coin_name",
                    "id": 3,
                    "options": {
                        "default": "Bitcoin"
                    }
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "version",
                    "id": 4,
                    "options": {
                        "default": 1
                    }
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "lock_time",
                    "id": 5,
                    "options": {
                        "default": 0
                    }
                }
            ]
        },
        {
            "name": "SimpleSignTx",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "TxInputType",
                    "name": "inputs",
                    "id": 1
                },
                {
                    "rule": "repeated",
                    "type": "TxOutputType",
                    "name": "outputs",
                    "id": 2
                },
                {
                    "rule": "repeated",
                    "type": "TransactionType",
                    "name": "transactions",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "coin_name",
                    "id": 4,
                    "options": {
                        "default": "Bitcoin"
                    }
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "version",
                    "id": 5,
                    "options": {
                        "default": 1
                    }
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "lock_time",
                    "id": 6,
                    "options": {
                        "default": 0
                    }
                }
            ]
        },
        {
            "name": "TxRequest",
            "fields": [
                {
                    "rule": "optional",
                    "type": "RequestType",
                    "name": "request_type",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "TxRequestDetailsType",
                    "name": "details",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "TxRequestSerializedType",
                    "name": "serialized",
                    "id": 3
                }
            ]
        },
        {
            "name": "TxAck",
            "fields": [
                {
                    "rule": "optional",
                    "type": "TransactionType",
                    "name": "tx",
                    "id": 1
                }
            ]
        },
        {
            "name": "RawTxAck",
            "fields": [
                {
                    "rule": "optional",
                    "type": "RawTransactionType",
                    "name": "tx",
                    "id": 1
                }
            ]
        },
        {
            "name": "EthereumSignTx",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "address_n",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "nonce",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "gas_price",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "gas_limit",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "to",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "value",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "data_initial_chunk",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "data_length",
                    "id": 8
                },
                {
                    "rule": "repeated",
                    "type": "uint32",
                    "name": "to_address_n",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "type": "OutputAddressType",
                    "name": "address_type",
                    "id": 10
                },
                {
                    "rule": "optional",
                    "type": "ExchangeType",
                    "name": "exchange_type",
                    "id": 11
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "chain_id",
                    "id": 12
                }
            ]
        },
        {
            "name": "EthereumTxRequest",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "data_length",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "signature_v",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "signature_r",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "signature_s",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "hash",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "signature_der",
                    "id": 6
                }
            ]
        },
        {
            "name": "EthereumTxAck",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "data_chunk",
                    "id": 1
                }
            ]
        },
        {
            "name": "SignIdentity",
            "fields": [
                {
                    "rule": "optional",
                    "type": "IdentityType",
                    "name": "identity",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "challenge_hidden",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "challenge_visual",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ecdsa_curve_name",
                    "id": 4
                }
            ]
        },
        {
            "name": "SignedIdentity",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "address",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "public_key",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "signature",
                    "id": 3
                }
            ]
        },
        {
            "name": "ApplyPolicies",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "PolicyType",
                    "name": "policy",
                    "id": 1
                }
            ]
        },
        {
            "name": "FirmwareErase",
            "fields": []
        },
        {
            "name": "FirmwareUpload",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "payload_hash",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "payload",
                    "id": 2
                }
            ]
        },
        {
            "name": "DebugLinkDecision",
            "fields": [
                {
                    "rule": "required",
                    "type": "bool",
                    "name": "yes_no",
                    "id": 1
                }
            ]
        },
        {
            "name": "DebugLinkGetState",
            "fields": []
        },
        {
            "name": "DebugLinkState",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "layout",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "pin",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "matrix",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mnemonic",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "HDNodeType",
                    "name": "node",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "passphrase_protection",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "reset_word",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "reset_entropy",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "recovery_fake_word",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "recovery_word_pos",
                    "id": 10
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "recovery_cipher",
                    "id": 11
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "recovery_auto_completed_word",
                    "id": 12
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "firmware_hash",
                    "id": 13
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "storage_hash",
                    "id": 14
                }
            ]
        },
        {
            "name": "DebugLinkStop",
            "fields": []
        },
        {
            "name": "DebugLinkLog",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "level",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "bucket",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "text",
                    "id": 3
                }
            ]
        },
        {
            "name": "DebugLinkFillConfig",
            "fields": []
        }
    ],
    "enums": [
        {
            "name": "FailureType",
            "values": [
                {
                    "name": "Failure_UnexpectedMessage",
                    "id": 1
                },
                {
                    "name": "Failure_ButtonExpected",
                    "id": 2
                },
                {
                    "name": "Failure_SyntaxError",
                    "id": 3
                },
                {
                    "name": "Failure_ActionCancelled",
                    "id": 4
                },
                {
                    "name": "Failure_PinExpected",
                    "id": 5
                },
                {
                    "name": "Failure_PinCancelled",
                    "id": 6
                },
                {
                    "name": "Failure_PinInvalid",
                    "id": 7
                },
                {
                    "name": "Failure_InvalidSignature",
                    "id": 8
                },
                {
                    "name": "Failure_Other",
                    "id": 9
                },
                {
                    "name": "Failure_NotEnoughFunds",
                    "id": 10
                },
                {
                    "name": "Failure_NotInitialized",
                    "id": 11
                },
                {
                    "name": "Failure_FirmwareError",
                    "id": 99
                }
            ]
        },
        {
            "name": "OutputScriptType",
            "values": [
                {
                    "name": "PAYTOADDRESS",
                    "id": 0
                },
                {
                    "name": "PAYTOSCRIPTHASH",
                    "id": 1
                },
                {
                    "name": "PAYTOMULTISIG",
                    "id": 2
                },
                {
                    "name": "PAYTOOPRETURN",
                    "id": 3
                },
                {
                    "name": "PAYTOWITNESS",
                    "id": 4
                },
                {
                    "name": "PAYTOP2SHWITNESS",
                    "id": 5
                }
            ]
        },
        {
            "name": "InputScriptType",
            "values": [
                {
                    "name": "SPENDADDRESS",
                    "id": 0
                },
                {
                    "name": "SPENDMULTISIG",
                    "id": 1
                },
                {
                    "name": "EXTERNAL",
                    "id": 2
                },
                {
                    "name": "SPENDWITNESS",
                    "id": 3
                },
                {
                    "name": "SPENDP2SHWITNESS",
                    "id": 4
                }
            ]
        },
        {
            "name": "RequestType",
            "values": [
                {
                    "name": "TXINPUT",
                    "id": 0
                },
                {
                    "name": "TXOUTPUT",
                    "id": 1
                },
                {
                    "name": "TXMETA",
                    "id": 2
                },
                {
                    "name": "TXFINISHED",
                    "id": 3
                },
                {
                    "name": "TXEXTRADATA",
                    "id": 4
                }
            ]
        },
        {
            "name": "OutputAddressType",
            "values": [
                {
                    "name": "SPEND",
                    "id": 0
                },
                {
                    "name": "TRANSFER",
                    "id": 1
                },
                {
                    "name": "CHANGE",
                    "id": 2
                },
                {
                    "name": "EXCHANGE",
                    "id": 3
                }
            ]
        },
        {
            "name": "ButtonRequestType",
            "values": [
                {
                    "name": "ButtonRequest_Other",
                    "id": 1
                },
                {
                    "name": "ButtonRequest_FeeOverThreshold",
                    "id": 2
                },
                {
                    "name": "ButtonRequest_ConfirmOutput",
                    "id": 3
                },
                {
                    "name": "ButtonRequest_ResetDevice",
                    "id": 4
                },
                {
                    "name": "ButtonRequest_ConfirmWord",
                    "id": 5
                },
                {
                    "name": "ButtonRequest_WipeDevice",
                    "id": 6
                },
                {
                    "name": "ButtonRequest_ProtectCall",
                    "id": 7
                },
                {
                    "name": "ButtonRequest_SignTx",
                    "id": 8
                },
                {
                    "name": "ButtonRequest_FirmwareCheck",
                    "id": 9
                },
                {
                    "name": "ButtonRequest_Address",
                    "id": 10
                },
                {
                    "name": "ButtonRequest_FirmwareErase",
                    "id": 11
                },
                {
                    "name": "ButtonRequest_ConfirmTransferToAccount",
                    "id": 12
                },
                {
                    "name": "ButtonRequest_ConfirmTransferToNodePath",
                    "id": 13
                },
                {
                    "name": "ButtonRequest_ChangeLabel",
                    "id": 14
                },
                {
                    "name": "ButtonRequest_ChangeLanguage",
                    "id": 15
                },
                {
                    "name": "ButtonRequest_EnablePassphrase",
                    "id": 16
                },
                {
                    "name": "ButtonRequest_DisablePassphrase",
                    "id": 17
                },
                {
                    "name": "ButtonRequest_EncryptAndSignMessage",
                    "id": 18
                },
                {
                    "name": "ButtonRequest_EncryptMessage",
                    "id": 19
                },
                {
                    "name": "ButtonRequest_ImportPrivateKey",
                    "id": 20
                },
                {
                    "name": "ButtonRequest_ImportRecoverySentence",
                    "id": 21
                },
                {
                    "name": "ButtonRequest_SignIdentity",
                    "id": 22
                },
                {
                    "name": "ButtonRequest_Ping",
                    "id": 23
                },
                {
                    "name": "ButtonRequest_RemovePin",
                    "id": 24
                },
                {
                    "name": "ButtonRequest_ChangePin",
                    "id": 25
                },
                {
                    "name": "ButtonRequest_CreatePin",
                    "id": 26
                },
                {
                    "name": "ButtonRequest_GetEntropy",
                    "id": 27
                },
                {
                    "name": "ButtonRequest_SignMessage",
                    "id": 28
                },
                {
                    "name": "ButtonRequest_ApplyPolicies",
                    "id": 29
                },
                {
                    "name": "ButtonRequest_SignExchange",
                    "id": 30
                }
            ]
        },
        {
            "name": "PinMatrixRequestType",
            "values": [
                {
                    "name": "PinMatrixRequestType_Current",
                    "id": 1
                },
                {
                    "name": "PinMatrixRequestType_NewFirst",
                    "id": 2
                },
                {
                    "name": "PinMatrixRequestType_NewSecond",
                    "id": 3
                }
            ]
        },
        {
            "name": "MessageType",
            "values": [
                {
                    "name": "MessageType_Initialize",
                    "id": 0
                },
                {
                    "name": "MessageType_Ping",
                    "id": 1
                },
                {
                    "name": "MessageType_Success",
                    "id": 2
                },
                {
                    "name": "MessageType_Failure",
                    "id": 3
                },
                {
                    "name": "MessageType_ChangePin",
                    "id": 4
                },
                {
                    "name": "MessageType_WipeDevice",
                    "id": 5
                },
                {
                    "name": "MessageType_FirmwareErase",
                    "id": 6
                },
                {
                    "name": "MessageType_FirmwareUpload",
                    "id": 7
                },
                {
                    "name": "MessageType_GetEntropy",
                    "id": 9
                },
                {
                    "name": "MessageType_Entropy",
                    "id": 10
                },
                {
                    "name": "MessageType_GetPublicKey",
                    "id": 11
                },
                {
                    "name": "MessageType_PublicKey",
                    "id": 12
                },
                {
                    "name": "MessageType_LoadDevice",
                    "id": 13
                },
                {
                    "name": "MessageType_ResetDevice",
                    "id": 14
                },
                {
                    "name": "MessageType_SignTx",
                    "id": 15
                },
                {
                    "name": "MessageType_SimpleSignTx",
                    "id": 16
                },
                {
                    "name": "MessageType_Features",
                    "id": 17
                },
                {
                    "name": "MessageType_PinMatrixRequest",
                    "id": 18
                },
                {
                    "name": "MessageType_PinMatrixAck",
                    "id": 19
                },
                {
                    "name": "MessageType_Cancel",
                    "id": 20
                },
                {
                    "name": "MessageType_TxRequest",
                    "id": 21
                },
                {
                    "name": "MessageType_TxAck",
                    "id": 22
                },
                {
                    "name": "MessageType_CipherKeyValue",
                    "id": 23
                },
                {
                    "name": "MessageType_ClearSession",
                    "id": 24
                },
                {
                    "name": "MessageType_ApplySettings",
                    "id": 25
                },
                {
                    "name": "MessageType_ButtonRequest",
                    "id": 26
                },
                {
                    "name": "MessageType_ButtonAck",
                    "id": 27
                },
                {
                    "name": "MessageType_GetAddress",
                    "id": 29
                },
                {
                    "name": "MessageType_Address",
                    "id": 30
                },
                {
                    "name": "MessageType_EntropyRequest",
                    "id": 35
                },
                {
                    "name": "MessageType_EntropyAck",
                    "id": 36
                },
                {
                    "name": "MessageType_SignMessage",
                    "id": 38
                },
                {
                    "name": "MessageType_VerifyMessage",
                    "id": 39
                },
                {
                    "name": "MessageType_MessageSignature",
                    "id": 40
                },
                {
                    "name": "MessageType_PassphraseRequest",
                    "id": 41
                },
                {
                    "name": "MessageType_PassphraseAck",
                    "id": 42
                },
                {
                    "name": "MessageType_EstimateTxSize",
                    "id": 43
                },
                {
                    "name": "MessageType_TxSize",
                    "id": 44
                },
                {
                    "name": "MessageType_RecoveryDevice",
                    "id": 45
                },
                {
                    "name": "MessageType_WordRequest",
                    "id": 46
                },
                {
                    "name": "MessageType_WordAck",
                    "id": 47
                },
                {
                    "name": "MessageType_CipheredKeyValue",
                    "id": 48
                },
                {
                    "name": "MessageType_EncryptMessage",
                    "id": 49
                },
                {
                    "name": "MessageType_EncryptedMessage",
                    "id": 50
                },
                {
                    "name": "MessageType_DecryptMessage",
                    "id": 51
                },
                {
                    "name": "MessageType_DecryptedMessage",
                    "id": 52
                },
                {
                    "name": "MessageType_SignIdentity",
                    "id": 53
                },
                {
                    "name": "MessageType_SignedIdentity",
                    "id": 54
                },
                {
                    "name": "MessageType_GetFeatures",
                    "id": 55
                },
                {
                    "name": "MessageType_EthereumGetAddress",
                    "id": 56
                },
                {
                    "name": "MessageType_EthereumAddress",
                    "id": 57
                },
                {
                    "name": "MessageType_EthereumSignTx",
                    "id": 58
                },
                {
                    "name": "MessageType_EthereumTxRequest",
                    "id": 59
                },
                {
                    "name": "MessageType_EthereumTxAck",
                    "id": 60
                },
                {
                    "name": "MessageType_CharacterRequest",
                    "id": 80
                },
                {
                    "name": "MessageType_CharacterAck",
                    "id": 81
                },
                {
                    "name": "MessageType_RawTxAck",
                    "id": 82
                },
                {
                    "name": "MessageType_ApplyPolicies",
                    "id": 83
                },
                {
                    "name": "MessageType_DebugLinkDecision",
                    "id": 100
                },
                {
                    "name": "MessageType_DebugLinkGetState",
                    "id": 101
                },
                {
                    "name": "MessageType_DebugLinkState",
                    "id": 102
                },
                {
                    "name": "MessageType_DebugLinkStop",
                    "id": 103
                },
                {
                    "name": "MessageType_DebugLinkLog",
                    "id": 104
                },
                {
                    "name": "MessageType_DebugLinkFillConfig",
                    "id": 105
                }
            ]
        }
    ]
}).build();