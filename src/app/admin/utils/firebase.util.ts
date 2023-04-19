import { finalize } from "rxjs";
import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable()

/**
 * FirebaseService Class
 */
export class FirebaseService {
  /**
   * FirebaseService Class Constructor
   *
   * @param firestore AngularFirestore
   * @param storage AnglarFireStorage
   */
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  /**
   * Fetch all docs from collection
   *
   * @param list string
   *
   * @returns Observeable
   */
  getAllData(list: string) {
    return new Promise((resolve, reject) => {
      const holder: any = [];
      this.firestore
        .collection(list)
        .get()
        .subscribe((data) => {
          data.forEach((item) => {
            const data: any = item.data();
            data["docId"] = item.id;
            holder.push(data);
          });
          resolve(holder);
        });
    });
  }

  /**
   * Update doc within collection w.r.t doc Id
   *
   * @param id string
   * @param list string
   * @param data any
   *
   * @returns Observeable
   */
  updateDataById(id: any, list: string, data: any) {
    return this.firestore.collection(list).doc(id).update(data);
  }

  /**
   * Get doc from collection w.r.t doc Id
   *
   * @param id string
   * @param list string
   *
   * @returns Observeable
   */
  getById(id: string, list: string) {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection(list)
        .doc(id)
        .get()
        .subscribe((item) => {
          if (!item.exists) {
            reject("No doc found.");
          } else {
            resolve(item.data());
          }
        });
    });
  }

  /**
   * Upload file to cloud storage
   *
   * @param fileInstance object
   * @param path string
   *
   * @returns Observeable
   */
  uploadFile(fileInstance: any, path: string) {
    return new Promise((resolve, reject) => {
      const filePath = `${path}/${fileInstance.name}`;
      const storageRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, fileInstance.file);

      // delete existing file if available w.r.t url
      if (fileInstance.removeFile && fileInstance.removeUrl !== "") {
        this.storage.refFromURL(fileInstance.removeUrl).delete();
      }

      // detect upload progress
      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() =>
            storageRef.getDownloadURL().subscribe((res) => {
              resolve({ path: filePath, response: res });
            })
          )
        )
        .subscribe();
    });
  }

  downloadFile = () => {
    const fileRef = this.storage.ref("path/to/file");

    fileRef.getDownloadURL().subscribe(
      (url) => {
        // Use the URL to download the file
        // For example, you can create a link to the file and programmatically click it
        const link = document.createElement("a");
        link.href = url;
        link.download = "filename.ext";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  /**
   * Delete a doc from collecton w.r.t doc Id
   *
   * @param list string
   * @param doc string
   *
   * @returns Observeable
   */
  delete(list: string, doc: string) {
    return this.firestore.collection(list).doc(doc).delete();
  }

  /**
   * Add new doc into a collection
   *
   * @param data any
   * @param collection string
   *
   * @returns Observeable
   */
  addDatatoDb(data: any, collection: any) {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection(collection)
        .doc()
        .set({ ...data })
        .then(() => resolve(true))
        .catch(() => reject(false));
    });
  }

  /**
   * query in collection
   *
   * @param field string
   * @param value string
   * @param collection string
   * @returns returns only single value
   */
  getData(dbfield: any, value: any, collection: any) {
    return new Promise<any>((resolve) => {
      const holder: any = [];
      this.firestore
        .collection(collection, (ref) => ref.where(dbfield, "==", value))
        .valueChanges({ idField: "docId" })
        .subscribe((data: any) => {
          resolve(data[0]);
        });
    });
  }

  /**
   * query in collection
   *
   * @param field string
   * @param value string
   * @param collection string
   * @returns returns only single value
   */
  getMultipleData(dbfield: any, value: any, collection: any) {
    return new Promise<any>((resolve) => {
      const holder: any = [];
      this.firestore
        .collection(collection, (ref) => ref.where(dbfield, "==", value))
        .valueChanges({ idField: "docId" })
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }
}
