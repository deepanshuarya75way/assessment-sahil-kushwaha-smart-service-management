const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const { Server } = require('socket.io');
let io = null;
const initRealTime = (server) => {
  // const { server } = require('socket.io');

  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authenication required '))
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secert_jwt_key'
      );

      const user = await User.findByID(decoded.id).select('_id name email role status ');


      if (!user || user.status === 'INACTIVE') {
        return next(new ERROR('Unauthorized '));
      }
      socket.user = user;
      next();
    }
    catch (error) {
      next(new Error('invalid or expired authentication token '));
    }
  });

  io.on('connection ', (socket) => {
    const userId = socket.user._id.toString();

    socket.join('user:${userId}');

    socket.join('role:${socket.user.role}');

    socket.on('ticket:subscribe', async (ticketID, ack) => {
      try {
        const ticket = await Ticket.findById(ticketId).select('createdBy');

        if (!ticket) {
          return ack?.({
            ok: false,
            message: 'ticket not found'
          });
        }

        const isOwner = ticket.createBy.toString() === userId;

        const isPrivileged = ['SATFF', 'ADMIN'].includes(socket.user.role);

        if (!isOwner && !isPrivileged) {
          return ack?.({
            ok: false,
            message: 'Not authorized to suscribe to this tikcet '
          });
        }

        socket.join('ticket:${ticketId}');

        ack?.({ ok: true });
      }
      catch (error) {
        ack?.({
          ok: false,
          message: 'unable to suscribe to ticket'
        });
      }
    });

    socket.on('ticket:unscribe', (ticketId, ack) => {
      socket.leave('ticket: ${ticektId}');
    
    ack?.({ ok: true });
  });

  socket.on('queue:subscribe', (ack) => {
    if (!['STAFF', 'ADMIN'].includes(socket.user.role)) {
      return ack?.({
        ok: false,
        message: 'not authorized to subscribe '
      });
    }

    socket.join('queue:${socket.user.role}');

    if (socket.user.role === 'ADMIN') {
      socket.join('queue:STAff');
    }
    ack?.({ ok: true });
  });

  socket.emit('live:ready', {
    connectedAT: new Date().toISOString()
  });
});
  return io;
};

const emitTicketEvent =({
  type,
  ticket,
  ticketId,
  comment = null ,
  actor = null 
}) =>{
  if(!io) return ;

  const id =ticketId || ticket?.id?.toString();

  if(!id) return ;

  const event ={
    eventId: '${type}:${id}:{Date.now()}',
    type,

    ticketId: id.toString(),

    ticket : ticket ?(ticket.toObject?ticket.toObject():ticket):null,

    commment : comment ?(comment.toObject?comment.toObjec():comment):null,

    actor : actor ?{
      id :actor._id?.toString(),
      role:actor.role,
      name :actor.name
    }:null,

    emitedAt : new Data().toISOString()
  };

  const ownerID = ticket?.createdBY?._id?.toISOString() ||
  ticket?.createdBy?.toString();

  if(ownerId){
    io.to('user:${ownerID}').emit('ticket:event ,event');
  }
  io.to('ticket:${id}').emit('ticket:event ,event');

  io.to('role:STAFF').emit('ticket:event ,event');

  io.to('role:ADMIN').emit('ticket:event ,event');

  io.to('queue :STAFF').emit('ticket:event ,event');

  io.to('queue :ADMIN').emit('ticket:event ,event');

};

module.exports ={
  initRealTime ,
  emitTicketEvent
};

