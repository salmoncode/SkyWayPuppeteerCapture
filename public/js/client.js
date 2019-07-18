document.querySelector("#btn").addEventListener("click", async () => {
    const peerId = document.querySelector("#text-box").value
    localStream = await navigator.mediaDevices.getUserMedia({ video: true })
    const peer = new Peer(peerId, { key: "ec12c0b0-68df-4999-ad70-a3b0f203d51d" })

    peer.on("open", () => {
        room = peer.joinRoom("room", { mode: 'mesh', stream: localStream })
        room.on("open", () => console.log("open"))
    })
})
