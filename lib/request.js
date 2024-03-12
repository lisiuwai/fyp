import ENV from '../config.env';

export async function getAllRooms(){
    const email = localStorage.getItem('userEmail'); 
    const response = await fetch(`${ENV.BASE_URL}/room?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const { success, data } = await response.json();
    if (!success) throw new Error('Error on fetch room');
    return data;
}


export async function getMessages(roomid){
    const{success, data} = await (await fetch(`${ENV.BASE_URL}/chat/${roomid}`)).json();
    if(!success) throw new Error('Error on fetch messages');
    return data;
}

export async function createRoom(email) {
    console.log('Email being sent:', email);
    const response = await fetch(`${ENV.BASE_URL}/room`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), 
    });
    if (!response.ok) {
        throw new Error('Failed to create the room');
    }
    return await response.json();
}


export async function deleteRoom(roomid){
    const{success, data} = await (await fetch(`${ENV.BASE_URL}/room/${roomid}`,{
        method: 'DELETE'
    })).json();
    const room = await Room.findById(id).populate('messages');
    if (!room) return res.status(404).json({ error: "Room not found" });

    const messageIds = room.messages.map(message => message._id);
   
    await Message.deleteMany({ _id: { $in: messageIds } });
    if(!success) throw new Error('Error on delete room');
    return data;
}

export async function sendMessage({roomid, message}){
    if(!roomid && !message) throw new Error("Invalid arguments");
    const{success, data} = await (await fetch(`${ENV.BASE_URL}/chat/${roomid}`,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({question : message})
    })).json();
    if(!success) throw new Error('Error sending message');
    return {success,data};
}

export async function updateRoom(roomid, newName) {
    const response = await fetch(`${ENV.BASE_URL}/room/${roomid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
    });
    if (!response.ok) {
        throw new Error('Error on update room');
    }
    const data = await response.json();
    return data;
}
