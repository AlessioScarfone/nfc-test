window.onload = function () {

    const logElement = document.getElementById('log');
    const statusElement = document.getElementById('status');
    const readBtn = document.getElementById("read");

    updateStatus("INIT")
    console.log("START - NDEFReader in window:", "NDEFReader" in window);

    if (!("NDEFReader" in window)) {
        consoleLog("Web NFC is not supported.");
        readBtn.setAttribute("disabled", true);
    } else {
        readBtn.addEventListener('click', readTag);
    }
    updateStatus("END INIT")

    async function readTag() {
        updateStatus("Start - readTag")
        if ("NDEFReader" in window) {
            try {
                const ndef = new NDEFReader();
                updateStatus("onReading - Scan start...")
                await ndef.scan();
                updateStatus("Scan started successfully.")

                ndef.onreading = event => {
                    const decoder = new TextDecoder();
                    for (const record of event.message.records) {
                        consoleLog("Record type:  " + record.recordType);
                        consoleLog("MIME type:    " + record.mediaType);
                        consoleLog("=== data ===\n" + decoder.decode(record.data));
                    }
                    updateStatus("onReading - END")
                }

                ndef.onreadingerror = event => {
                    console.log("error:", event)
                    consoleLog("Error:  " + JSON.stringify(event));
                    updateStatus("onReading Error - END")
                }
            } catch (error) {
                consoleLog(error);
            }
        } else {
            consoleLog("Web NFC is not supported.");
            updateStatus("NOT SUPPORTED!")
        }
    }

    // async function writeTag() {
    //     if ("NDEFReader" in window) {
    //         const ndef = new NDEFReader();
    //         try {
    //             await ndef.write("What Web Can Do Today");
    //             consoleLog("NDEF message written!");
    //         } catch (error) {
    //             consoleLog(error);
    //         }
    //     } else {
    //         consoleLog("Web NFC is not supported.");
    //     }
    // }

    function consoleLog(data) {
        logElement.innerHTML = data + '\n';
    };

    function updateStatus(data) {
        statusElement.innerHTML = data + '\n';
    }
}
