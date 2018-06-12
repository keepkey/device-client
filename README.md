# keepkey-device-client
Version: 5.4.1

A typescript library for communicating with the Keepkey HID

[Here's an example implementation in Node](https://github.com/keepkey/Node-example "A Node Example")

After using node-hid to grab the KeepKey device, we can use our definition of Transport to invoke any of the defined actions. In the following we see a call to `initialize` that returns a promise containing a description of device features which are then logged.

```javascript
NodeTransport.factory(hid, (deviceClient: DeviceClient) => {
  deviceClient.initialize().then((features: any) => {
    console.log(features.data);
  })
})
```

### Device Client Methods by Action Type

#### ApplyPolicyActions

`.enablePolicy(policyName: DevicePolicyEnum, enabled: boolean)`

#### ApplySettingsActions

`.enablePassphrase(usePassphrase: boolean)`

`.changeLabel(label: string)`

#### CancelActions

`.cancel()`

#### ChangePinActions

`.changePin(options: ChangePinOptions)`

ChangePinOptions:

```javascript
{
  remove: boolean, // false
}
```

#### CharacterAckAction

`.characterAck(options: CharacterAckOptions)`

CharacterAckOptions:

```javascript
{
  character: string,  // ''
  delete: boolean, // false
  done: boolean, // false
}
```

#### CipherKeyValueActions

This action has no correlary DeviceClient methods, but is used by CipherNodeVectorActions.

#### CipherNodeVectorActions

`.encryptNodeVector(nodeVector: NodeVector | string)`

`.decryptNodeVector(nodeVector: NodeVector | string)`

#### EncryptMessageAction

`.encryptMessage(options: EncyptMessageOptions)`

EncryptMessageOptions:

```javascript
{
  addressN: NodeVector | string, // new NodeVector([])
  message: ByteBuffer, // ByteBuffer.wrap('')
  publicKey: ByteBuffer, // ByteBuffer.wrap('')
  displayOnly: boolean, // false
  coinName: string // 'Bitcoin'
}
```

#### EndSessionAction

`.endSession()`

#### FirmwareUploadAction

`.firmwareUpload()`

#### GetAddressAction

`.getAddress(addressN: NodeVector, coinName: string)`

#### GetEthereumAddressAction

`.getEthereumAddress(addressN: NodeVector, showDisplay: boolean)`

#### GetPublicKeyAction

`.getPublicKey(addressN: NodeVector | string, showDisplay: boolean)`

#### InitializeAction

`.initialize()`

#### PassphraseAckAction

`.sendPassphrase(passphrase: string)`

#### PinMatrixAckAction

`.pinMatrixAck(options: PinMatrixOptions)`

PinMatrixOptions:

```javascript
{
  pin: string // ''
}
```

#### RecoverDeviceAction

`.recoveryDevice(options: RecoverDeviceOptions)`

^ written as 'recovery' in device-client.ts. Is this a typo?

RecoverDeviceOptions:

```javascript
{
  passphrase_protection: boolean, // false
  pin_protection: boolean, // true
  language: string, // null
  label: string, // null
  word_count: number, // 12
  enforce_wordlist: boolean, // true
  use_character_cipher: boolean // true
}
```

#### ResetDeviceAction

`.resetDevice(options: ResetDeviceOptions)`

ResetDeviceOptions:

```javascript
{
    display_random: boolean, // false
    passphrase_protection: boolean, // false
    pin_protection: boolean, // true
    language: string, // 'english'
    label: string // null
}
```

#### SignMessageAction

`.signMessage(options: SignMessageOptions)`

SignMessageOptions:

```javascript
{
  addressN: NodeVector | string, // new NodeVector([])
  message: ByteBuffer, // ByteBuffer.wrap('')
  coinName: string // 'Bitcoin'
}
```

#### WipeDeviceAction

`.wipeDevice()`

#### WordAckAction

`.wordAck(options: WordAckOptions)`

WordAckOptions:

```javascript
{
  word: string // ''
}
```

### Node Environment

```javascript

import { NodeTransport } from '@keepkey/device-client/dist/node-transport';

// instanciating a client for use:

const client = NodeTransport.factory(hidDevice);

// hidDevice
// Now you can call the methods described above on the client

client.initialize();

// Maybe before you're done with it you'll thouroughly disconnect from the device

const disconnect = (deviceClient) => {
  deviceClient.destroy();
  deviceClient.transport.hid.close();
  DeviceClientManager.instance.remove(deviceClient.transport.deviceId);
}

// We should consider moving things like this disconnect function into Device Client itself


'''
