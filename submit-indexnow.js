const host = "www.moonnaturallyyours.com";
const key = "8ef509905d28457eaad94fac582c5c13";
const keyLocation = `https://${host}/${key}.txt`;

const urlList = [
  `https://${host}/`,
  `https://${host}/about`,
  `https://${host}/journal`,
  `https://${host}/media`,
  `https://${host}/faqs`,
  `https://${host}/privacy-policy`,
  `https://${host}/terms`,
  `https://${host}/shipping-policy`,
];

async function submitToIndexNow() {
  console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList,
      }),
    });

    if (response.ok || response.status === 202 || response.status === 200) {
      console.log(`✅ Successfully submitted to IndexNow! (Status: ${response.status})`);
    } else {
      console.error(`❌ Failed to submit. Status: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error("Response:", text);
    }
  } catch (error) {
    console.error("❌ Error submitting to IndexNow:", error);
  }
}

submitToIndexNow();
