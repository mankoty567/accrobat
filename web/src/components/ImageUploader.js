import React, { useRef } from 'react';
import { Input } from '@material-ui/core';

//TODO : Changer le système de prévisu, et le permettre juste dans child, et mettre une liste MUI

/**
 * Composant permettat d'uploader et faire un comportement directement derrière
 *
 * @param {Function} callback Fonction permettant de récupérer l'image pour exécuter une fonction ensuite avec derrière
 * @param {JSX.Element} childs Permet d'ajouter des composants sous le composant afin de le personnaliser
 * @param {number} [maxSize] Taille maximale d'une image en input. Sous la forme [hauteur, largeur]
 * @param {Function} [setErrMessage] Fonction permettant de gérer l'affichage d'une erreur derrière
 */
let ImageUploader = ({
  callback,
  childs,
  maxSize,
  setErrMessage,
}) => {
  let inputFile = useRef(null);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
    });

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
              console.log(err);
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

      {childs ? childs : null}
    </>
  );
};

export default ImageUploader;
