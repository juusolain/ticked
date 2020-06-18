import Dexie from 'dexie'

var db = new Dexie('ticked-db')

db.version(1).stores({
  tasks: '&taskid, userid, listid',
  lists: '&listid, userid'
})

export default db
