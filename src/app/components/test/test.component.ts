import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Test } from '../../models/test';
import { TestService } from '../../services/test.service';



@Component({
  selector: 'app-test',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule], // Import necessary modules
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  form: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  user: User | null = null;
  isFormSubmitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private testService: TestService,
   
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    // Configurar el formulario dividido en secciones
    this.form = this.fb.group({
      section1: this.fb.group({
        field1: ['', Validators.required],
        field2: ['', Validators.required],
        field3: ['', Validators.required]
      }),
      section2: this.fb.group({
        field4: ['', Validators.required],
        field5: ['', Validators.required],
        field6: ['', Validators.required]
      }),
      section3: this.fb.group({
        field7: ['', Validators.required],
        field8: ['', Validators.required],
        field9: ['', Validators.required]
      })
    });

    // Obtener el usuario actual
    this.userService.currentUser.subscribe({
      next: (user) => {
        this.user = user;
      }
    });
  }

  // Navegar al siguiente paso del formulario
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  // Navegar al paso anterior del formulario
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Enviar el formulario si es válido
  submitForm() {
    if (this.form.valid && this.user && this.user.id) { // Asegurar que `this.user` y `this.user.id` están definidos
      const testDetails = {
        user: { id: Number(this.user.id) }, // Convertir `id` a número de forma segura
        pregunta1: this.form.get('section1.field1')!.value,
        pregunta2: this.form.get('section1.field2')!.value,
        pregunta3: this.form.get('section1.field3')!.value,
        pregunta4: this.form.get('section2.field4')!.value,
        pregunta5: this.form.get('section2.field5')!.value,
        pregunta6: this.form.get('section2.field6')!.value,
        pregunta7: this.form.get('section3.field7')!.value,
        pregunta8: this.form.get('section3.field8')!.value,
        pregunta9: this.form.get('section3.field9')!.value,
        
      };
  
      this.testService.registerTest(testDetails).subscribe({
        next: () => {
          if (this.user && this.user.id) { // Re-verificar para asegurar que no sea nulo
            this.testService.updateIsTestDone(Number(this.user.id)).subscribe({
              next: () => {
                this.user!.isTestDone = true;
                // Llamar al método `aviso` después de actualizar el estado del test 
                
              },
              error: (err) => { console.error('Error updating test status', err);
               }
            });
          }
        },
        error: (err) => { console.error('Error registering test', err); 
      }
      }); 
    }
    this.aviso(); 
    this.goHome();
  }

  //metodo para crear alerta
  aviso(){
    this.isFormSubmitted = true;
  }

  // Redirigir al usuario a la página de inicio
  goHome() {
    this.router.navigateByUrl("/dashboard");
  }
}
