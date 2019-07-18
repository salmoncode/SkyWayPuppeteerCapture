const peer = new Peer({ key: "ec12c0b0-68df-4999-ad70-a3b0f203d51d" })

let videoTrack
peer.on("open", () => {
    room = peer.joinRoom("room", { mode: 'mesh', stream: null })
    room.on("open", () => console.log("open"))
    room.on("stream", async stream => videoTrack = stream.getVideoTracks()[0])
})

const getImage = async () => {
    const capture = new ImageCapture(videoTrack)
    const bitMap = await capture.grabFrame()
    const canvas = document.createElement("canvas")
    canvas.width = bitMap.width
    canvas.height = bitMap.height

    const ctx = canvas.getContext("2d")
    ctx.drawImage(bitMap,0,0,bitMap.width, bitMap.height)
    return canvas.toDataURL('image/png')
}