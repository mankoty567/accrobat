import React, { useRef } from 'react';
import { Input } from '@material-ui/core';

/**
 * Composant permettat d'uploader et faire un comportement directement derrière
 *
 * @param {Function} callback Fonction permettant de récupérer l'image pour exécuter une fonction ensuite avec derrière
 * @param {number} [maxSize] Taille maximale d'une image en input. Sous la forme [hauteur, largeur]
 * @param {Function} [setErrMessage] Fonction permettant de gérer l'affichage d'une erreur derrière
 */
let ImageUploader = ({ callback, maxSize, setErrMessage }) => {
  //Variable d'interface
  let inputFile = useRef(null);

  /**
   * Permet de transformer un objet d'image importé en base64
   * @param {Object} file L'image importée en objet JSON
   * @returns {Object} Une image en base64
   */
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
    });

  /**
   * Fonction pour changer le fichier en entrée
   */
  let handleChange = () => {
    //Vérifie si on a un fichier
    if (inputFile.current.files.length === 1) {
      let file_img = inputFile.current.files[0];
      let img = new Image();
      img.src = window.URL.createObjectURL(file_img);

      img.onload = () => {
        if (
          maxSize
            ? maxSize[0] > img.naturalHeight &&
              maxSize[1] > img.naturalWidth
            : true
        ) {
          setErrMessage ? setErrMessage('') : null;

          toBase64(file_img)
            .then((base64img) => {
              callback(base64img);
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          setErrMessage
            ? setErrMessage(
                `L'image actuelle dépasse le format attendu (${maxSize[0]}px * ${maxSize[1]}px)`,
              )
            : null;
        }
      };
    } else {
      console.log('Aucun fichier trouvé !');
    }
  };

  return (
    <>
      <Input
        type="file"
        onChange={() => handleChange()}
        inputRef={inputFile}
      ></Input>
    </>
  );
};

export default ImageUploader;
