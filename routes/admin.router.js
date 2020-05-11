const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')


const mongoose = require('mongoose')

AdminBro.registerAdapter(AdminBroMongoose)

const Polyclinic = require('../models/Polyclinic')
const Doctor = require('../models/Doctor')
const Test = require('../models/Test')
const Appointment = require('../models/Appointment')

const adminBro = new AdminBro({
  databases: [mongoose],

  branding: {
    logo:'https://seeklogo.com/images/H/hospital-clinic-plus-logo-7916383C7A-seeklogo.com.png',
    companyName: 'Hastanem',
    
  },
  dashboard: {
    component: AdminBro.require('../views/dashboard')
  },
  resources:[{
      resource: Polyclinic,
      options: {
          parent: {
          name: 'AAAAA',
          icon: 'fas fa-cogs',
      }
    }
  }],
  resources:[{
    resource: Doctor,
    options: {
        parent: {
        name: 'AAAAA',
        icon: 'fas fa-cogs',
    }
  }
}],
resources:[{
  resource: Test,
  options: {
      parent: {
      name: 'AAAAA',
      icon: 'fas fa-cogs',
  }
}
}],

resources:[{
  resource: Appointment,
  options: {
      parent: {
      name: 'Randevu',
      icon: 'fas fa-cogs',
  }
}
}],
  rootPath: '/admin',
})

const router = AdminBroExpress.buildRouter(adminBro)

module.exports = router