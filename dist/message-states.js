"use strict";
var _ = require("lodash");
var DeviceExecutionMode;
(function (DeviceExecutionMode) {
    DeviceExecutionMode[DeviceExecutionMode["running"] = 0] = "running";
    DeviceExecutionMode[DeviceExecutionMode["bootLoader"] = 1] = "bootLoader";
    DeviceExecutionMode[DeviceExecutionMode["debug"] = 2] = "debug";
})(DeviceExecutionMode = exports.DeviceExecutionMode || (exports.DeviceExecutionMode = {}));
var MessageDirection;
(function (MessageDirection) {
    MessageDirection[MessageDirection["request"] = 0] = "request";
    MessageDirection[MessageDirection["response"] = 1] = "response";
})(MessageDirection = exports.MessageDirection || (exports.MessageDirection = {}));
var MessageSender;
(function (MessageSender) {
    MessageSender[MessageSender["host"] = 0] = "host";
    MessageSender[MessageSender["device"] = 1] = "device";
})(MessageSender = exports.MessageSender || (exports.MessageSender = {}));
var MessageStates = (function () {
    function MessageStates() {
    }
    MessageStates.getMessageState = function (sender, direction, name) {
        return _.find(MessageStates.states, {
            messageName: name,
            sender: sender,
            messageType: direction
        });
    };
    MessageStates.register = function (state) {
        MessageStates.states.push(state);
    };
    return MessageStates;
}());
MessageStates.states = [];
exports.MessageStates = MessageStates;
MessageStates.register({
    messageName: "Initialize",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Features",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "GetFeatures",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Features",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "Features",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "ClearSession",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "ApplySettings",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    rejectMessage: "Failure",
    interstitialMessages: [
        "ButtonRequest",
        "PinMatrixRequest"
    ],
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "ChangePin",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    rejectMessage: "Failure",
    interstitialMessages: [
        "ButtonRequest",
        "PinMatrixRequest"
    ],
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "Ping",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "Success",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "Failure",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "ButtonRequest",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.request,
    resolveMessage: "ButtonAck",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "ButtonAck",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "PinMatrixRequest",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.request,
    resolveMessage: "PinMatrixAck",
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "PinMatrixAck",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "Cancel",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    userInteractionRequired: false,
    resolveMessage: "Failure"
});
MessageStates.register({
    messageName: "PassphraseRequest",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.request,
    resolveMessage: "PassphraseAck",
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "PassphraseAck",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "GetEntropy",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Entropy",
    rejectMessage: "Failure",
    interstitialMessages: [
        "ButtonRequest"
    ],
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "Entropy",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "GetPublicKey",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "PublicKey",
    rejectMessage: "Failure",
    interstitialMessages: [
        "PassphraseRequest",
        "PinMatrixRequest"
    ],
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "PublicKey",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "GetAddress",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Address",
    rejectMessage: "Failure",
    interstitialMessages: [
        "ButtonRequest",
        "PinMatrixRequest",
        "PassphraseRequest"
    ],
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "EthereumGetAddress",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "EthereumAddress",
    rejectMessage: "Failure",
    interstitialMessages: [
        "ButtonRequest",
        "PinMatrixRequest",
        "PassphraseRequest"
    ],
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "Address",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "EthereumAddress",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "WipeDevice",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    rejectMessage: "Failure",
    interstitialMessages: [
        "ButtonRequest"
    ],
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "LoadDevice",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    rejectMessage: "Failure",
    interstitialMessages: [
        "ButtonRequest",
        "PassphraseRequest"
    ],
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "ResetDevice",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    rejectMessage: "Failure",
    interstitialMessages: [
        "EntropyRequest",
        "PinMatrixRequest",
        "ButtonRequest",
        "PassphraseRequest"
    ],
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "EntropyRequest",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.request,
    resolveMessage: "EntropyAck",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "EntropyAck",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "RecoveryDevice",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    rejectMessage: "Failure",
    interstitialMessages: [
        "WordRequest",
        "PinMatrixRequest",
        "CharacterRequest"
    ],
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "WordRequest",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.request,
    resolveMessage: "WordAck",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "WordAck",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.response,
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "CharacterRequest",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.request,
    resolveMessage: "CharacterAck",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "CharacterAck",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.response,
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "SignMessage",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "MessageSignature",
    rejectMessage: "Failure",
    interstitialMessages: [
        "PinMatrixRequest",
        "PassphraseRequest",
        "ButtonRequest"
    ],
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "VerifyMessage",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    rejectMessage: "Failure",
    interstitialMessages: [
        "PinMatrixRequest",
        "PassphraseRequest"
    ],
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "MessageSignature",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "EncryptMessage",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "EncryptedMessage",
    rejectMessage: "Failure",
    interstitialMessages: [
        "PinMatrixRequest",
        "PassphraseRequest"
    ],
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "EncryptedMessage",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "DecryptMessage",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    rejectMessage: "Failure",
    interstitialMessages: [
        "PinMatrixRequest",
        "PassphraseRequest"
    ],
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "DecryptedMessage",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "CipherKeyValue",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "CipheredKeyValue",
    rejectMessage: "Failure",
    interstitialMessages: [
        "PinMatrixRequest",
        "PassphraseRequest"
    ],
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "CipheredKeyValue",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "EstimateTxSize",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "TxSize",
    rejectMessage: "Failure",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "TxSize",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "SignTx",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "TxRequest_TXFINISHED",
    rejectMessage: "Failure",
    interstitialMessages: [
        "PassphraseRequest",
        "PinMatrixRequest",
        "ButtonRequest",
        "TxRequest_TXINPUT",
        "TxRequest_TXOUTPUT",
        "TxRequest_TXMETA"
    ],
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "SimpleSignTx",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "TxRequest",
    rejectMessage: "Failure",
    interstitialMessages: [
        "PassphraseRequest",
        "PinMatrixRequest"
    ],
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "TxRequest",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.request,
    resolveMessage: "TxAck",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "TxAck",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "EthereumSignTx",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "EthereumTxRequest",
    rejectMessage: "Failure",
    interstitialMessages: [
        "PassphraseRequest",
        "PinMatrixRequest",
        "ButtonRequest"
    ],
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "EthereumTxRequest",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "SignIdentity",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "SignedIdentity",
    rejectMessage: "Failure",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "SignedIdentity",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "FirmwareErase",
    validMode: DeviceExecutionMode.bootLoader,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    rejectMessage: "Failure",
    interstitialMessages: [
        "ButtonRequest"
    ],
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "FirmwareUpload",
    validMode: DeviceExecutionMode.bootLoader,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    rejectMessage: "Failure",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "ApplyPolicies",
    validMode: DeviceExecutionMode.running,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    rejectMessage: "Failure",
    interstitialMessages: [
        "ButtonRequest"
    ],
    userInteractionRequired: true
});
MessageStates.register({
    messageName: "DebugLinkDecision",
    validMode: DeviceExecutionMode.debug,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "Success",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "DebugLinkGetState",
    validMode: DeviceExecutionMode.debug,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    resolveMessage: "DebugLinkState",
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "DebugLinkState",
    validMode: DeviceExecutionMode.debug,
    sender: MessageSender.device,
    messageType: MessageDirection.response,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "DebugLinkStop",
    validMode: DeviceExecutionMode.debug,
    sender: MessageSender.host,
    messageType: MessageDirection.request,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "DebugLinkLog",
    validMode: DeviceExecutionMode.debug,
    sender: MessageSender.device,
    messageType: MessageDirection.request,
    userInteractionRequired: false
});
MessageStates.register({
    messageName: "DebugLinkFillConfig",
    validMode: DeviceExecutionMode.debug,
    sender: MessageSender.device,
    messageType: MessageDirection.request,
    userInteractionRequired: false
});
