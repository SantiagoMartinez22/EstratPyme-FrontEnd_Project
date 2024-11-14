import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Test } from '../models/test';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private baseUrl = 'http://localhost:8080/api/tests';
  private userUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  // Registrar un nuevo test o actualizar si ya existe
  registerTest(testDetails: Test): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}?userId=${testDetails.id_empresa}`).pipe(
      switchMap((existingTests) => {
        if (existingTests.length > 0) {
          // Si el test ya existe, actualízalo
          return this.http.put(`${this.baseUrl}/${existingTests[0].id}`, testDetails);
        } else {
          // Si no existe, crea un nuevo test
          return this.http.post(this.baseUrl, testDetails);
        }
      })
    );
  }

  // Actualizar la bandera isTestDone en el usuario
  updateIsTestDone(userId: number): Observable<any> {
    return this.http.patch(`${this.userUrl}/${userId}/test-done`, { isTestDone: true });
  }

  

  // Obtener todos los tests de un usuario
  getTestsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?id=${userId}`);
  }
}