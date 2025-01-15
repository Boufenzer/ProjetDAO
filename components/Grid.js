import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';


const NOMBRE_COLONNES = 8;
const NOMBRE_LIGNES = 8;


const DIAMANTS = [
  require('../assets/images/Diamant1.png'),
  require('../assets/images/Diamant2.png'),
  require('../assets/images/Diamant3.png'),
  require('../assets/images/Diamant4.png'),
  require('../assets/images/Diamant5.png'),
  require('../assets/images/Diamant6.png'),
  require('../assets/images/Diamant7.png'),
  require('../assets/images/Diamant8.png'),
];

class Grille extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      grille: this.genererGrille(), 
      celluleSelectionnee: null, 
    };
  }

  
  genererGrille() {
    let grille = [];
    for (let ligne = 0; ligne < NOMBRE_LIGNES; ligne++) {
      let ligneArray = [];
      for (let colonne = 0; colonne < NOMBRE_COLONNES; colonne++) {
       
        ligneArray.push(Math.floor(Math.random() * 7));
      }
      grille.push(ligneArray);
    }
    return grille;
  }

  
  echangerImages(ligne, colonne) {
    const { celluleSelectionnee } = this.state;

    if (celluleSelectionnee) {
      
      const [lignePrecedente, colonnePrecedente] = celluleSelectionnee;

      
      if (
        (Math.abs(ligne - lignePrecedente) === 1 && colonne === colonnePrecedente) ||
        (Math.abs(colonne - colonnePrecedente) === 1 && ligne === lignePrecedente)
      ) {
        let nouvelleGrille = [...this.state.grille];
        
        const temporaire = nouvelleGrille[lignePrecedente][colonnePrecedente];
        nouvelleGrille[lignePrecedente][colonnePrecedente] = nouvelleGrille[ligne][colonne];
        nouvelleGrille[ligne][colonne] = temporaire;

        this.setState({ grille: nouvelleGrille, celluleSelectionnee: null });
      } else {
        
        this.setState({ celluleSelectionnee: [ligne, colonne] });
      }
    } else {
      
      this.setState({ celluleSelectionnee: [ligne, colonne] });
    }
  }

  render() {
    let elementsGrille = []; 
  
    for (let ligne = 0; ligne < NOMBRE_LIGNES; ligne++) {
      let elementsLigne = []; 
  
      for (let colonne = 0; colonne < NOMBRE_COLONNES; colonne++) {
        elementsLigne.push(
          <TouchableOpacity
            key={`${ligne}-${colonne}`}
            onPress={() => this.echangerImages(ligne, colonne)}
          >
            <Image
              source={DIAMANTS[this.state.grille[ligne][colonne]]}
              style={styles.cellule}
            />
          </TouchableOpacity>
        );
      }
  
     
      elementsGrille.push(
        <View key={ligne} style={styles.ligne}>
          {elementsLigne}
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        {elementsGrille}
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  ligne: {
    flexDirection: 'row',
  },
  cellule: {
    width: 50,
    height: 50,
    margin: 2,
    borderWidth: 2, 
    borderColor: '#000', 
  },
});

export default Grille;
