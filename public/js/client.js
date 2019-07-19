document.querySelector("input").value = moment().format('YYYY-MM-DD-hh-mm-ss')

let localStream
(async() => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    console.log(devices)
    const deviceOptions = devices.filter(device => device.kind === "videoinput").map(device => {
        const option = document.createElement("option")
        option.textContent = device.label
        option.value = device.deviceId
        return option
    })
    const deviceList = document.querySelector("#devices")
    deviceOptions.forEach(deviceOption => deviceList.append(deviceOption))

    localStream = await navigator.mediaDevices.getUserMedia({ video: true })
    document.querySelector("video").srcObject = localStream
})()

document.querySelector("#btn").addEventListener("click", async () => {
    const peerId = document.querySelector("#text-box").value
    const peer = new Peer(peerId, { key: "ec12c0b0-68df-4999-ad70-a3b0f203d51d" })

    peer.on("open", () => {
        room = peer.joinRoom("room", { mode: 'mesh', stream: localStream })
        room.on("open", () => {
            document.querySelector("#command").textContent = `capture get ${peerId}`
        })
    })
})
