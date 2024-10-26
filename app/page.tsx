"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Patient = {
  id: number
  name: string
  age: number
  condition: string
  admitted: boolean
  assignedDoctor?: string
}

type Doctor = {
  id: number
  name: string
  specialty: string
}

export default function HospitalManagement() {
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: "John Doe", age: 45, condition: "Flu", admitted: true },
    { id: 2, name: "Jane Smith", age: 32, condition: "Broken Arm", admitted: true },
  ])
  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: 1, name: "Dr. Alice Johnson", specialty: "General Medicine" },
    { id: 2, name: "Dr. Bob Williams", specialty: "Orthopedics" },
    { id: 3, name: "Dr. Carol Brown", specialty: "Pediatrics" },
  ])
  const [newPatient, setNewPatient] = useState({ name: "", age: "", condition: "" })
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "" })

  const assignDoctors = useCallback(() => {
    setPatients(currentPatients => 
      currentPatients.map(patient => {
        if (!patient.assignedDoctor) {
          const availableDoctor = doctors.find(doctor => 
            !currentPatients.some(p => p.assignedDoctor === doctor.name)
          )
          if (availableDoctor) {
            return { ...patient, assignedDoctor: availableDoctor.name }
          }
        }
        return patient
      })
    )
  }, [doctors])

  useEffect(() => {
    assignDoctors()
  }, [assignDoctors])

  const addPatient = () => {
    if (newPatient.name && newPatient.age && newPatient.condition) {
      setPatients(prevPatients => [
        ...prevPatients,
        {
          id: prevPatients.length + 1,
          name: newPatient.name,
          age: parseInt(newPatient.age),
          condition: newPatient.condition,
          admitted: true,
        },
      ])
      setNewPatient({ name: "", age: "", condition: "" })
    }
  }

  const addDoctor = () => {
    if (newDoctor.name && newDoctor.specialty) {
      setDoctors(prevDoctors => [
        ...prevDoctors,
        {
          id: prevDoctors.length + 1,
          name: newDoctor.name,
          specialty: newDoctor.specialty,
        },
      ])
      setNewDoctor({ name: "", specialty: "" })
    }
  }

  const toggleAdmission = (id: number) => {
    setPatients(prevPatients =>
      prevPatients.map((patient) =>
        patient.id === id ? { ...patient, admitted: !patient.admitted } : patient
      )
    )
  }

  const assignDoctor = (patientId: number, doctorName: string) => {
    setPatients(prevPatients =>
      prevPatients.map((patient) =>
        patient.id === patientId ? { ...patient, assignedDoctor: doctorName } : patient
      )
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hospital Management System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <Label htmlFor="patientName">Name</Label>
                <Input
                  id="patientName"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="patientAge">Age</Label>
                <Input
                  id="patientAge"
                  type="number"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="patientCondition">Condition</Label>
                <Input
                  id="patientCondition"
                  value={newPatient.condition}
                  onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
                />
              </div>
              <Button onClick={addPatient}>Add Patient</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Doctor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <Label htmlFor="doctorName">Name</Label>
                <Input
                  id="doctorName"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="doctorSpecialty">Specialty</Label>
                <Input
                  id="doctorSpecialty"
                  value={newDoctor.specialty}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                />
              </div>
              <Button onClick={addDoctor}>Add Doctor</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {patients.map((patient) => (
                <Card key={patient.id} className="mb-2">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p>Age: {patient.age}</p>
                    <p>Condition: {patient.condition}</p>
                    <p>Status: {patient.admitted ? "Admitted" : "Discharged"}</p>
                    <p>Assigned Doctor: {patient.assignedDoctor || "None"}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Button onClick={() => toggleAdmission(patient.id)}>
                        {patient.admitted ? "Discharge" : "Admit"}
                      </Button>
                      <Select
                        onValueChange={(value) => assignDoctor(patient.id, value)}
                        value={patient.assignedDoctor}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Assign Doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.name}>
                              {doctor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doctor List</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="mb-2">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{doctor.name}</h3>
                    <p>Specialty: {doctor.specialty}</p>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}