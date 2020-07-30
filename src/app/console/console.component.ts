import { Component, OnInit } from '@angular/core';
import { SpbService } from '../services/spb.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {


  users;
  isEdtUser = false;
  edtUser;
  roles;
  directors;
  acteurs;
  formEdit: FormGroup;
  formFilmEdit: FormGroup;
  formDirectorEdit: FormGroup;
  formActorEdit: FormGroup;


  films: any;
  isEdtFilm = false;
  edtFilm;
  isAddFilm = false;

  actorsData = [];

  isEdtDirector = false;
  edtDirector;
  isAddDirector = false;

  isEdtActor = false;
  edtActor;
  isAddActor = false;
  actorOptions: any;


  constructor(private spb: SpbService, private fb: FormBuilder,
    private fb1: FormBuilder,
    private fb2: FormBuilder,
    private fb3: FormBuilder,
    private toastr: ToastrService) {
    this.formEdit = this.fb.group({
      roleControl: ['USER']
    });

    this.formFilmEdit = this.fb1.group({
      filmId: [''],
      filmTitle: ['', [Validators.required]],
      filmDirector: ['', [Validators.required]],
      filmActors: new FormArray([]),
      filmDate: ['', [Validators.required]],
      filmPrix: ['', [Validators.required]]

    });

    

    this.formDirectorEdit = this.fb2.group({
      directorId: [''],
      directorName: ['', [Validators.required]]
    });

    this.formActorEdit = this.fb3.group({
      actorId: [''],
      actorName: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.roles = this.spb.getRoles();
    this.init();
  }

  init() {

    this.recupereUsers();
    this.recupereFilms();
    this.recupereDirectors();
    this.recupereActeurs();
  }

  /******* User  */
  recupereUsers() {
    this.spb.getUsers().subscribe(
      data => {
        this.users = data;

        if (this.users) {
          const newUsers = this.users.map(element => {
            let totalTrue = 0;
            if (element.carts) {
              totalTrue = element.carts.filter(el => el.inCart === true).length;

            }
            element.totalTrue = totalTrue;
          });
        }
        console.log(this.users);
      }
    );

  }

  deleteUser(user) {

    if (confirm('Are you sure you want to delete this user, ' + user.pseudo + ' !')) {
      this.spb.deteleUser(user);
      this.toastr.warning(user.pseudo + " are deleted !", "User", {
        timeOut: 1000,
        progressBar: true,
        progressAnimation: 'increasing'
      })
    }
    this.recupereUsers();
  }

  editUser(user) {
    this.formEdit = this.fb.group({
      roleControl: [user.role]
    });

    this.isEdtUser = !this.isEdtUser;
    this.edtUser = user;
  }

  validRoleUser(user) {
    if (confirm('Are you sure you want to edited this user,  "' + this.formEdit.value.roleControl + '" !')) {

      this.isEdtUser = !this.isEdtUser;
      this.spb.validRoleUser(user, this.formEdit.value);
      this.toastr.success(user.pseudo + " are edited with sucess !", "User", {
        timeOut: 1000,
        progressBar: true,
        progressAnimation: 'increasing'
      })

    }
    this.recupereUsers();

  }

  deleteFilmUser(user, cart) {
    console.log(cart);
    if (confirm('Are You sure you want to delete this movie,  "' + cart.title + '" !')) {
      cart.inCart = false;
      this.spb.setUsers(this.users);
      this.spb.setCarts(user.carts);
    }
    this.recupereUsers();
  }


  /******* Films  */
  recupereFilms() {
    this.spb.getAllMoviesFull().subscribe(
      data => {
        this.films = data;
        console.log(this.films);

      }
    )
  }

  deletefilm(film) {
    console.log(film);
    if (confirm('You will delete this movie, ' + film.title + ' !')) {
      this.spb.deleteFilm(film).subscribe(
        data => {
          this.toastr.warning(film.title + " are delete with success !", "Movie", {
            timeOut: 1000,
            progressBar: true,
            progressAnimation: 'increasing'
          })
          this.init();
        }
      )
    }
  }

  editFilm(film) {

    console.log("edit film 142 ", film, film.director);
    this.formFilmEdit = this.fb1.group({
      filmId: [film.id],
      filmTitle: [film.title],
      //filmDirector: [film.director.id +" : " +film.director.name],
      //filmActors: [film.actors],
      filmDirector: [film.director.id],
      filmDate: [film.date],
      filmPrix: [film.prix]
    });

    console.log("edit film 152", this.formFilmEdit.value, film.director.id + " : " + film.director.name);


    this.isEdtFilm = !this.isEdtFilm;
    this.edtFilm = film;
    console.log(this.isEdtFilm, film);

  }

  valideEditFilm(film) {

    console.log(" 163 >> validate :  debut validate ", film, this.formFilmEdit.value);

    film.id = this.formFilmEdit.value.filmId;
    film.title = this.formFilmEdit.value.filmTitle;
    film.date = this.formFilmEdit.value.filmDate;
    film.prix = this.formFilmEdit.value.filmPrix;
    let newDirector = this.directors.filter(dir => dir.id === parseInt(this.formFilmEdit.value.filmDirector));
    console.log(" 177 >>> newDirector ", newDirector);
    film.director = { id: newDirector[0].id, name: newDirector[0].name };

    console.log("notre nouveau film : ", film);

    if (confirm('Are you sure you want validate,  "' + this.formFilmEdit.value.filmTitle + '" !')) {


      this.isEdtFilm = !this.isEdtFilm;
      this.edtFilm = film;
      console.log(" avant service ", film);
      this.spb.editFilm(film).subscribe(
        data => {
          console.log(data);

          console.log("203 ac form ", this.formFilmEdit);
          this.toastr.success(film.title + " are edit with success !", "Movie", {
            timeOut: 1000,
            progressBar: true,
            progressAnimation: 'increasing'
          })

        },
        error => {
          console.log("error for ", film);
          this.toastr.error(film.title + " are not add !", "Movie", {
            timeOut: 1000,
            progressBar: true,
            progressAnimation: 'increasing'
          })
        },
        () => {
          console.log(" complete ", film);
          // Mise à zéro des champs :
          this.formFilmEdit = this.fb1.group({
            filmId: [''],
            filmTitle: [''],
            filmDirector: [''],
            //filmActors: [''],
            filmDate: [''],
            filmPrix: ['']

          });
          this.init();
        }
      )

    }
    //this.init();
  }

  addFilm() {
    this.isAddFilm = true;
    console.log("On va ajouter  un film ");
  }

  valideAddFilm() {

    console.log(" status du form ", this.formFilmEdit.status, this.formFilmEdit);
    if (this.formFilmEdit.status === 'VALID') {
      let film = {
        title: this.formFilmEdit.value.filmTitle, date: this.formFilmEdit.value.filmDate, prix: this.formFilmEdit.value.filmPrix,
        director: "/directors/" + this.formFilmEdit.value.filmDirector
      };

      console.log(this.formFilmEdit.value.filmTitle);

      console.log(" validation de l'ajout", film);
      if (confirm('Are you sure you want to add this movie, ' + film.title + ' !')) {
        this.spb.addFilm(film).subscribe(
          data => {

            this.init();
            this.toastr.success(film.title + " are add !", "Movie", {
              timeOut: 1000,
              progressBar: true,
              progressAnimation: 'increasing'
            })
          },
          error => {
            console.log("Erreur, addFilm", film);
            this.toastr.error(film.title + " are not add with success !", "Movie", {
              timeOut: 1000,
              progressBar: true,
              progressAnimation: 'increasing'
            })
          },
          () => {
            this.isAddFilm = false;

            // complete on remet les champs à zéro :
            this.formFilmEdit = this.fb1.group({
              filmId: [''],
              filmTitle: [''],
              filmDirector: [''],
              //filmActors: [''],
              filmDate: [''],
              filmPrix: ['']

            });
          }
        )
      }
    }
    else {
      this.formFilmEdit.markAllAsTouched();
      alert(" All fields are not completed ! ");
    }

  }

  cancelFilm() {
    if (confirm('Are you sure you want to discontinue adding this movie ?')) {
      this.isAddFilm = false;
    }
  }

  /******* Director  */
  recupereDirectors() {
    this.spb.getAllDirectors().subscribe(
      data => {
        this.directors = data['_embedded']['directors'];
        this.directors.map(di => di.films = []);
        console.log(this.directors);
        this.spb.getAllDirectorsFull().subscribe(
          dataD => {
            let directorsFull;
            // tslint:disable-next-line:forin
            for (const i in dataD) {
              directorsFull = this.directors;
              this.directors.map(element => {
                if (element.id === dataD[i].director.id) {
                  const film = {
                    id: dataD[i],
                    prix: dataD[i].prix,
                    title: dataD[i].title
                  };
                  element.films = [...element.films, film];
                }
              });
            }
            console.log(directorsFull);
            this.directors = directorsFull;
          });
      });
  }

  deleteDirector(director) {
    if (confirm('Are you sure you want to delete this director, ' + director.name + ' !')) {
      this.spb.deleteDirector(director).subscribe(
        data => {
          this.init();
          this.toastr.info(director.name + " are delete with success !", "Director", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing'
          })
        },
        error => {
          console.log(error, error.status)
          if (error.status === 409) {
            alert('To delete this director you must delete all movies from : ' + director.name);
          }
        }
      )
    }
  }

  editDirector(director) {

    console.log("edit director 336 ", director, director.name);
    this.formDirectorEdit = this.fb2.group({
      directorId: [''],
      directorName: [director.name]
    });

    console.log("edit director 337", this.formDirectorEdit.value, director.id + " : " + director.name);


    this.isEdtDirector = !this.isEdtDirector;
    this.edtDirector = director;
    console.log(this.isEdtDirector, director);

  }

  valideEditDirector(director) {

    console.log(" 342 >> validate :  debut validate ", director, this.formDirectorEdit.value);

    director.name = this.formDirectorEdit.value.directorName;


    console.log("notre nouveau film : ", director);

    if (confirm('Are you sure you want to validate the attributes of this film,  "' + this.formDirectorEdit.value.directorName + '" !')) {


      this.isEdtDirector = !this.isEdtDirector;
      this.edtDirector = director;
      console.log(" avant service director ", director);
      this.spb.editDirector(director).subscribe(
        data => {
          this.toastr.success(director.name + " are edited with success !", "Director", {
            timeOut: 1000,
            progressBar: true,
            progressAnimation: 'increasing'
          })

          console.log("359 ac form ", this.formDirectorEdit)
        },
        error => {
          console.log("error for ", director);

          this.toastr.error(director.name + " are not add with success !", "Director", {
            timeOut: 1000,
            progressBar: true,
            progressAnimation: 'increasing'
          })
        },
        () => {
          console.log(" complete ", director);
          // Mise à zéro des champs :
          this.formDirectorEdit = this.fb2.group({
            directorId: [''],
            directorName: ['', [Validators.required]]
          });
          this.init();
        }
      )

    }
    //this.init();
  }

  addDirector() {
    this.isAddDirector = true;
  }

  valideAddDirector() {

    console.log(" status du form ", this.formDirectorEdit.status)
    if (this.formDirectorEdit.status === 'VALID') {
      let director = {
        name: this.formDirectorEdit.value.directorName
      };

      console.log(this.formDirectorEdit.value.directorName);

      console.log(" validation de l'ajout", director);
      if (confirm('Are you sure you want to add this director, ' + director.name + ' !')) {
        this.spb.addDirector(director).subscribe(
          data => {
            this.toastr.success(director.name + " are add with success !", "Director", {
              timeOut: 1000,
              progressBar: true,
              progressAnimation: 'increasing'
            })
            this.init();
          },
          error => {
            console.log("Erreur, addDirector", director);
            this.toastr.error(director.name + " are not add with success !", "Director", {
              timeOut: 1000,
              progressBar: true,
              progressAnimation: 'increasing'
            })
          },
          () => {
            this.isAddDirector = false;

            // complete on remet les champs à zéro :
            this.formDirectorEdit = this.fb2.group({
              directorId: [''],
              directorName: ['']

            });
          }
        )
      }
    }
    else {
      this.formFilmEdit.markAllAsTouched();
      alert(" All fields are not completed! ");
    }

  }


  cancelDirector() {
    if (confirm('Are you sure you want to abandon adding this Director? !')) {
      this.isAddDirector = false;
    }
  }


  /******* Actor  */
  recupereActeurs() {
    this.spb.getAllActeurs().subscribe(
      data => {
        this.acteurs = data['_embedded']['actors'];
        ////////

        this.actorsData = this.acteurs;
        this.actorOptions = this.acteurs;


        ////////
        //console.log(this.acteurs);
        this.acteurs.map(elmt => {
          //console.log(elmt);
          this.spb.getActeurs(elmt).subscribe(
            res => {
              const films = res;
              elmt.films = films;
            }
          ),
            error => console.log('Erreur, de récupération getActeurs')
        });

      },
      error => console.log('Erreur, de recuperation getAllActeursFull')
    )
  }

  deleteActor(actor) {
    if (confirm('Are you sure you wand ton delete, ' + actor.name + ' !')) {
      this.spb.deleteActor(actor).subscribe(
        data => {
          this.init();
          this.toastr.info(actor.name + " are delete with success !", "Actor", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing'
          })
        },
        error => {
          console.log(error, error.status)
          if (error.status === 409) {
            alert('Before delete : ' + actor.name + ', you must delete all his movies !');
          }
        }
      )
    }
  }

  addActor() {
    this.isAddActor = true;
  }

  valideAddActor() {

    console.log(" status du form ", this.formActorEdit.status)
    if (this.formActorEdit.status === 'VALID') {
      let actor = {
        name: this.formActorEdit.value.actorName
      };

      console.log(this.formActorEdit.value.actorName);

      console.log(" validation de l'ajout", actor);
      if (confirm('Are you sure you want to add this Actor, ' + actor.name + ' !')) {
        this.spb.addActor(actor).subscribe(
          data => {
            this.toastr.success(actor.name + " are add with success !", "Actor", {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing'
            })
            this.init();
          },
          error => {
            console.log("Erreur, addActor", actor);
            this.toastr.error(actor.name + " are not add with success !", "Actor", {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing'
            })
          },
          () => {
            this.isAddActor = false;

            // complete on remet les champs à zéro :
            this.formActorEdit = this.fb3.group({
              actorId: [''],
              actorName: ['']

            });
          }
        )
      }
    }
    else {
      this.formFilmEdit.markAllAsTouched();
      alert(" Not all fields are completed! ");
    }

  }


  cancelActor() {
    if (confirm('Are you sure you want to abandon the add of this Actor !')) {
      this.isAddActor = false;
    }
  }

  editActor(actor) {

    this.formActorEdit = this.fb3.group({
      actorId: [''],
      actorName: [actor.name]
    });

    this.isEdtActor = !this.isEdtActor;
    this.edtActor = actor;
    console.log(this.isEdtActor, actor);

  }


  valideEditActor(actor) {

    console.log(" 342 >> validate :  debut validate ", actor, this.formActorEdit.value);

    actor.name = this.formActorEdit.value.actorName;


    console.log("notre nouveau acteur : ", actor);

    if (confirm('Are you sure you want to edit this ,  "' + this.formActorEdit.value.actorName + '" !')) {


      this.isEdtActor = !this.isEdtActor;
      this.edtActor = actor;
      console.log(" avant service director ", actor);
      this.spb.editActor(actor).subscribe(
        data => {
          this.toastr.success(actor.name + " are edited with success !", "Actor", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing'
          })

          console.log("359 ac form ", this.formActorEdit)
        },
        error => {
          console.log("error for ", actor);

          this.toastr.error(actor.name + " are not add with success !", "Actor", {
            timeOut: 1000,
            progressBar: true,
            progressAnimation: 'increasing'
          })
        },
        () => {
          console.log(" complete ", actor);
          // Mise à zéro des champs :
          this.formActorEdit = this.fb3.group({
            actorId: [''],
            actorName: ['', [Validators.required]]
          });
          this.init();
        }
      )

    }
  }



}
