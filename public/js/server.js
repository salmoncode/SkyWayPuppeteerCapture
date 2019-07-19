const peer = new Peer({ key: "ec12c0b0-68df-4999-ad70-a3b0f203d51d" })

let streams

peer.on("open", () => {
    room = peer.joinRoom("room", { mode: 'mesh', stream: null })
    room.on("open", () => streams = [])
    room.on("stream", async stream => {
        if(stream.getVideoTracks()) streams.push(stream)
    })
    room.on('peerLeave', peerId => streams = streams.filter(stream => stream.peerId !== peerId))
})

const getImage = async peerId => {
    const stream = streams.find(stream => stream.peerId === peerId)
    if(!stream) return null
    try{
        const videoTrack = stream.getVideoTracks()[0]
        const capture = new ImageCapture(videoTrack)
        const bitMap = await capture.grabFrame()

        const canvas = document.createElement("canvas")
        canvas.width = bitMap.width
        canvas.height = bitMap.height

        const ctx = canvas.getContext("2d")
        ctx.drawImage(bitMap,0,0,bitMap.width, bitMap.height)
        return canvas.toDataURL('image/png')
    } catch (err) {

    }
}