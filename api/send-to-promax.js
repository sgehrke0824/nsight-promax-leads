export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !lastName || !email || !phone) {
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
      <id>102</id>
      <vendorname>Nsight Performance Group</vendorname>
    </vendor>
    <provider>
      <name part="full">Nsight Performance Group</name>
      <service>Nsight Popup Lead</service>
    </provider>
  </prospect>
</adf>`;

    const response = await fetch('https://leads.dealermarketingservices.com/ADF/ADFLeadReceiver.dll/ADFVendor', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('nsight@promaxonline.local:pQA6fvIv9P3ia2Fr').toString('base64'),
        'Content-Type': 'text/plain'
      },
      body: adfPayload
    });

    const result = await response.text();
    console.log("ProMax response:", result);

    res.status(200).send('Lead sent to ProMax');
  } catch (error) {
    console.error("Error sending to ProMax:", error);
    res.status(500).send('Internal Server Error');
  }
}
