
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone } = req.body;

  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<?adf version="1.0"?>
<adf>
  <prospect>
    <requestdate>${new Date().toISOString()}</requestdate>
    <vehicle interest="buy"><year/><make/><model/></vehicle>
    <customer>
      <contact primarycontact="1">
        <name part="first">${firstName}</name>
        <name part="last">${lastName}</name>
        <email>${email}</email>
        <phone type="cellphone">${phone}</phone>
      </contact>
      <comments><![CDATA[
<cardotcom>
  <notes>Disposition: Appointment Set</notes>
  <appointmentdate>${new Date().toISOString().slice(0, 10)} 09:00:00</appointmentdate>
  <dob>1970-01-01</dob>
  <creditauthorization>True</creditauthorization>
</cardotcom>
      ]]></comments>
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

  const headers = {
    "Authorization": "Basic " + Buffer.from("nsight@promaxonline.local:pQA6fvIv9P3ia2Fr").toString("base64"),
    "Content-Type": "text/plain"
  };

  try {
    const response = await fetch("https://leads.dealermarketingservices.com/ADF/ADFLeadReceiver.dll/ADFVendor", {
      method: "POST",
      headers: headers,
      body: xml
    });

    const responseText = await response.text();
    return res.status(200).json({
      success: true,
      xmlSent: xml,
      headersSent: headers,
      promaxResponse: responseText
    });
  } catch (error) {
    console.error("Error sending to ProMax:", error);
    return res.status(500).json({
      error: 'Failed to post to ProMax',
      detail: error.message,
      headersSent: headers,
      xmlSent: xml
    });
  }
};
