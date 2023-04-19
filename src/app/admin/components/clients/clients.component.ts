import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import Swal from "sweetalert2";
import { FirebaseService } from "../../utils/firebase.util";
import { base64Encode } from "@firebase/util";
import { PaginateUtil } from "src/app/admin/utils/Paginate.util";

@Component({
  selector: "app-clients",
  templateUrl: "./clients.component.html",
  styleUrls: ["./clients.component.scss"],
})
export class ClientsComponent implements OnInit {
  allClients: any = [];
  isLoading: boolean = true;
  constructor(
    private route: Router,
    private fireAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    public pagination: PaginateUtil
  ) {
    this.pagination.renderData = [];
  }

  // /**
  //  * NgInit Lifecycle
  //  */
  ngOnInit(): void {
    this.getData();
  }

 /**
  * fetch data from the  collection
  */
  getData = () => {
    this.firebaseService
      .getAllData("ourClients")
      .then((res: any) => {
        // sort wrt timestamp
        res.sort((a: any, b: any) => b?.timestamp - a?.timestamp);

        this.allClients = res;
        this.pagination.paginate(res, 10, 1);
        this.isLoading = false;
      })
      .catch((err: any) => {
        console.log("Error while getting clients data", err);
      });
  };

  /**
   *function to transform data into encoded string
   * @param data any
   * @returns encrypted version of the data
   */
  encrypt(data: any) {
    return base64Encode(JSON.stringify(data));
  }
  
  /**
   * Removing data from list
   * @param collectionName 
   * @param docId 
   */
  deleteClient = (collectionName: string, docId: string) => {
    Swal.fire({
      title: `Are you sure ?`,
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.firebaseService
          .delete(collectionName, docId)
          .then(() => {
            this.getData();
            Swal.fire({
              title: "Response alert!",
              html: "Record Deleted!",
              timer: 1000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
              },
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error alert!",
              html: "Error While Deleting this Record!",
              timer: 1000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
              },
            });
          });
      }
    });
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
