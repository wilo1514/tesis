const fs = require('fs');
const forge = require('node-forge');
const { SignedXml } = require('xml-crypto');

function firmarXML(xml, p12Path, p12Password) {
    const p12Buffer = fs.readFileSync(p12Path);
    const p12Asn1 = forge.asn1.fromDer(p12Buffer.toString('binary'));
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, p12Password);

    const keyObj = p12.getBags({ bagType: forge.pki.oids.keyBag }).keyBag[0];
    const key = forge.pki.privateKeyToPem(keyObj.key);

    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag }).certBag;
    const cert = forge.pki.certificateToPem(certBags[0].cert);

    const sig = new SignedXml();
    sig.addReference("//*[local-name(.)='factura']");
    sig.signingKey = key;
    sig.keyInfoProvider = {
        getKeyInfo: () => `<X509Data><X509Certificate>${cert}</X509Certificate></X509Data>`
    };

    sig.computeSignature(xml);

    return sig.getSignedXml();
}

module.exports = firmarXML;
