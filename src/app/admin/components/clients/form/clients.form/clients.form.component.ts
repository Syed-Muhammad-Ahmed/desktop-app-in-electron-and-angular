import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { base64Decode } from "@firebase/util";
import { FirebaseService } from "../../../../utils/firebase.util";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import Swal from "sweetalert2";

@Component({
  selector: "app-clients.form",
  templateUrl: "./clients.form.component.html",
  styleUrls: ["./clients.form.component.scss"],
})
export class ClientsFormComponent {
  data: any;
  loading: boolean = false;
  cName: any;
  desig: any;
  desc: any;
  stars: any;
  documentId: any;

  public selectedFile = {
    hasFile: false,
    removeFile: false,
    removeUrl: "",
    name: "",
    file: "",
  };

  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private fireAuth: AngularFireAuth,
    private firebaseService: FirebaseService
  ) {
    this.router.params.subscribe((params) => {
      const data = params["id"] !== undefined ? base64Decode(params["id"]) : "";
      if (data) {
        this.data = data;
        this.documentId = JSON.parse(data);
        this.firebaseService
          .getById(this.documentId, "ourClients")
          .then((res: any) => {
            this.data = res;
            this.cName = res.cName;
            this.desc = res.desc;
            this.desig = res.desig;
            this.stars = res.stars;
          })
          .catch((err: any) => {
            console.log("Error while fetching data", err);
          });
      }
    });
  }

  /**
   * handling file selection by the user
   * @param event any
   */
  setFileEvent(event: any) {
    const file = event.target.files[0];
    const ext = file.name.split(".")[1];
    const name = new Date().getTime() + "." + ext;
    this.selectedFile = {
      ...this.selectedFile,
      hasFile: true,
      name,
      file,
    };
  }

  /**
   * function for alerting the addition of client details
   */
  success = () => {
    this.loading = false;
    Swal.fire({
      title: "Response alert!",
      html: `Record ${this.data ? "Updated" : "Added"} Successfully!`,
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.route.navigate(["/admin/clients"]);
  };

  /**
   * submit function
   * @param obj any
   */
  submit = (obj: any) => {
    obj.timestamp = Date.now();
    this.loading = true;

    if (this.selectedFile.hasFile) {
      this.firebaseService
        .uploadFile(this.selectedFile, "ourClients/clients-picture")
        .then((downloadUrl: any) => {
          obj.img = downloadUrl;
          this.uploadFullData(obj);
        })
        .catch((err: any) => {
          console.log("Error while loading picture", err);
        });
    } else {
      if (this.data?.img) {
        obj.img = this.data.img;
        this.uploadFullData(obj);
      } else {
        this.loading = false;
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Please fill all fields!`,
        });
      }
    }
  };

  /**
   * sending data to the Data base
   *
   * @param obj any
   */
  uploadFullData = (obj: any) => {
    this.stars = this.stars.toString();

    if (
      this.cName?.trim()?.length &&
      this.desig?.trim()?.length &&
      this.desc?.trim()?.length &&
      this.stars?.trim()?.length
    ) {
      this.data
        ? this.firebaseService
            .updateDataById(this.documentId, "ourClients", obj)
            .then(() => {
              this.success();
            })
            .catch((err: any) => {
              console.log("Error while updating clients details", err);
            })
        : this.firebaseService
            .addDatatoDb(obj, "ourClients")
            .then(() => {
              this.success();
            })
            .catch((err: any) => {
              console.log("Error while adding clients details", err);
            });
    } else {
      this.loading = false;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Please fill all fields!`,
      });
    }
  };

  /**
   * logout function
   */
  logout = () => {
    this.fireAuth
      .signOut()
      .then(() => {
        localStorage.removeItem("commercioPublicDetails");
        this.route.navigate(["/admin/login"]);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Error while signing out!`,
        });
      });
  };
}
