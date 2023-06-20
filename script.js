window.onload = function () {

    const logElement = document.getElementById('log');
    const statusElement = document.getElementById('status');
    const readBtn = document.getElementById("read");
    let ndef = undefined;

    updateStatus("INIT")
    console.log("START - NDEFReader in window:", "NDEFReader" in window);
    
    if (!("NDEFReader" in window)) {
        consoleLog("Web NFC is not supported.");
        readBtn.setAttribute("disabled", true);
    } else {
        ndef = new NDEFReader();
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
            consoleLog("Error:  " + JSON.stringify(event));
            updateStatus("onReading Error - END")
        }
        readBtn.addEventListener('click', readTag);
    }


    updateStatus("END INIT")

    async function readTag() {
        updateStatus("Start - readTag")
        if ("NDEFReader" in window && ndef) {
            try {
                updateStatus("onReading - Start")
                await ndef.scan();
                updateStatus("onReading - end scan")
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