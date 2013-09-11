var restify = require('restify');

function respond(req,res,next) {
    res.send("{" + req + "} \n\n");
}

function Patient () {
    /*
        Okay, so... All of these types would have to be abstracted. I know this.
        But chill, man. it's a BETA!
    */
    
    
    this.text = {
        status : {
            value : "generated"
        },
        div:"<div>\n      <table>\n        <tbody>\n          <tr>\n            <td>Name<\/td>\n            <td>First Middle <b>Last<\/b> (&quot;Nickname&quot;)<\/td>\n          <\/tr>\n          <tr>\n            <td>Address<\/td>\n            <td>123 Example, Verona, WI, 12345<\/td>\n          <\/tr>\n          <tr>\n            <td>Contacts<\/td>\n            <td>Home: unknown. Work: (123) 456-7890<\/td>\n          <\/tr>\n          <tr>\n            <td>Id<\/td>\n            <td>MRN: 12345 (Epic Healthcare)<\/td>\n          <\/tr>\n        <\/tbody>\n      <\/table>\n    <\/div>"
    };
    
    this.identifier = [
        {
        use:{
          value:"usual"
        },
        label:{
          value:"MRN"
        },
        system:{
          value:"urn:oid:1.2.36.146.595.217.0.1"
        },
        key:{
          value:"12345"
        },
        period:{
          start:{
            value:"20013-09-11"
          }
        },
        assigner:{
          display:{
            value:"Epic Healthcare"
          }
        }
      }
    ];
    
    this.name = [
         {
        use:{
          value:"official"
        },
        family:[
          {
            value:"Last"
          }
        ],
        given:[
          {
            value:"First"
          },
          {
            value:"Middle"
          }
        ]
      },
      {
        use:{
          value:"usual"
        },
        given:[
          {
            value:"Nickname"
          }
        ]
      }
    ];
    
    this.telecom = [
        {
        use:{
          value:"home"
        }
      },
      {
        system:{
          value:"phone"
        },
        value:{
          value:"(123) 456-7890"
        },
        use:{
          value:"work"
        }
      }
    ];
    
    this.gender = {
        coding:[
        {
          system:{
            value:"http://hl7.org/fhir/v3/AdministrativeGender"
          },
          code:{
            value:"M"
          },
          display:{
            value:"Male"
          }
        }
      ]
    };
    
    this.birthDate = {
        value:"1979-7-4"
    }
    
    this.deceasedBoolean = {
        value: false
    };
    
    this.address = [
        {
        use:{
          value:"home"
        },
        line:[
          {
            value:"534 Erewhon St"
          }
        ],
        city:{
          value:"PleasantVille"
        },
        state:{
          value:"Vic"
        },
        zip:{
          value:"3999"
        }
      }
    ];
    
    this.contact = [
         {
        relationship:[
          {
            coding:[
              {
                system:{
                  value:"http://hl7.org/fhir/patient-contact-relationship"
                },
                code:{
                  value:"partner"
                }
              }
            ]
          }
        ],
        name:{
          family:[
            {
              extension:[
                {
                  url:{
                    value:"http://hl7.org/fhir/profile/@iso-21090#qualifier"
                  },
                  valueCode:{
                    value:"VV"
                  }
                }
              ],
              value:"Last"
            },
            {
              value:"First"
            }
          ],
          given:[
            {
              value:"Nickname"
            }
          ]
        },
        telecom:[
          {
            system:{
              value:"phone"
            },
            value:{
              value:"(123) 456-7890"
            }
          }
        ]
      }
    ];
    
    this.provider = {
        type:{
        value:"Organization"
      },
      reference:{
        value:"organization/@1"
      }
    };
    
    this.active = {
        value: true
    };
}



function Patients () {
    this.patients = {}; // JK TOTZ LAWLS SO TERRIBLE
    this.init = function () {
        var patient = new Patient();
        this.patients[patient.id] = patient;
        return this;
    };
    this.findPatientByID = function (id) {
        return this.patients[id]; // LOLZ dict is so inefficient. Patient Lookup FTW
    };
    this.updatePatientWithID = function (id, data) {
        // don't want to corrupt my only patient, so this is totes fake ATM.
        return this.patients[0];
    };
    this.createPatientWithID = function (id, data) {
        // Ummm... nah, why validate? JKJKJK... but for realzies
        return this.patients[0];
    };
    this.createPatient = function (data) {
        // So normally we'd do some ID checking, and you know, CODEZ
        return this.createPatientWithID(0, data);
    };
    this.deletePatientWithID = function (id) {
        // Yeah... not gonna delete my only patient. But we can pretendz
        return this.patients[0];
    };
}

function PatientHandler () {
    this.Patients = new Patients();
    this.getPatient =  function (req, res, next) {
        var patient = new Patient();
        res.send(patient);
        //res.send(this.Patients.findPatientbyID(req.params.id).toJSON());
    };
    this.putPatient = function (req, res, next) {
       if (this.Patients.exists(req.params.id)) {
            res.send(this.Patients.updatePatientWithID(req.params.id, req.body).toJSON());
       }
       else { // only if allowed by Business requirements
            res.send(this.Patients.createPatientWithID(req.params.id, req.body).toJSON());
       }
    };
    this.postPatient = function (req, res, next) {
        res.send(this.Patients.createPatient(req.body).toJSON());
    }
    this.deletePatient = function (req, res, next) {
        res.send(Patients.deletePatientWithID(req.params.id, body).toJSON());
    };
    // use properties to set internal logic for handlers - what methods to allow, etc.
}

var server = restify.createServer();
var patientHandler = new PatientHandler();
server.get('/patient/:id', patientHandler.getPatient);
server.put('/patient/:id', patientHandler.putPatient);
server.post('/patient/', patientHandler.postPatient);
//server.delete('/patient/:id', patientHandler.deletePatient);

server.listen(8080, function () {
    console.log("%s listening on %s.", server.name, server.url);
});