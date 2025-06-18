export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    console.log("Incoming Request Headers:", req.headers);
    console.log("Incoming Request Body:", req.body);

    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      console.error("Missing fields:", req.body);
      return res.status(400).send('Missing required fields');
    }

    const adfPayload = `<?xml version="1.0" encoding="UTF-8" ?>
<?adf version="1.0"?>
<adf>
  <prospect>
    <requestdate>${new Date().toISOString()}</requestdate>
    <vehicle interest="buy">
      <year></year>
      <make></make>
      <model></model>
    </vehicle>
    <customer>
      <contact primarycontact="1">
        <name part="first">${firstName}</name>
        <name part="last">${lastName}</name>
        <email>${email}</email>
        <phone type="cellphone">${phone}</phone>
      </contact>
      <comments><![CDATA[<cardotcom>
        <notes>Lead submitted via Nsight ConvertFlow popup</notes>
        <dob>1970-01-01</dob>
        <creditauthorization>True</creditauthorization>
      </cardotcom>]]></comments>
    </customer>
    <vendor>
      <id>3903</id>
      <vendorname>Nsight Performance Group</vendorname>
    </vendor>
    <provider>
      <name part="full">Nsight Performance Group</name>
      <service>Nsight Popup Lead</service>
    </provider>
  </prospect>
</adf>`;

    console.log("ADF Payload being sent:", adfPayload);

    const response = await fetch('https://leads.dealermarketingservices.com/ADF/ADFLeadReceiver.dll/ADFVendor', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('nsight@promaxonline.local:pQA6fvIv9P3ia2Fr').toString('base64'),
        'Content-Type': 'application/xml'
      },
      body: adfPayload
    });

    const result = await response.text();
    console.log("Response from ProMax:", result);

    res.status(200).send('Lead sent to ProMax');
  } catch (error) {
    console.error("Error during lead post:", error);
    res.status(500).send('Internal Server Error');
  }
}
