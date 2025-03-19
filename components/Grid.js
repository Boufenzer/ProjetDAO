import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, Button } from 'react-native';

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
      score: 0,
      niveau: 1,
      essais: 3,
      progression: 50, // Barre de progression initiale à 50%
      pause: false,
    };
  }
  
  componentDidMount() {
    this.startTimer();
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  
  // Démarre le timer qui décrémente la barre de progression toutes les 3 secondes
  startTimer() {
    this.timer = setInterval(() => {
      if (!this.state.pause) {
        this.setState(prevState => {
          let nouvelleProgression = prevState.progression - prevState.niveau;
          if (nouvelleProgression <= 0) {
            nouvelleProgression = 0;
            clearInterval(this.timer);
            alert("Game Over !");
          }
          return { progression: nouvelleProgression };
        });
      }
    }, 3000);
  }
  
  // Réinitialise le jeu et redémarre le timer
  restartGame() {
    clearInterval(this.timer);
    this.setState({
      grille: this.genererGrille(),
      celluleSelectionnee: null,
      score: 0,
      niveau: 1,
      essais: 3,
      progression: 50,
      pause: false,
    }, () => {
      this.startTimer();
    });
  }
  
  // Bascule l'état de pause
  togglePause() {
    this.setState(prevState => ({ pause: !prevState.pause }));
  }
  
  // Génère une grille 8x8 en évitant trois images identiques consécutives
  genererGrille() {
    let grille = [];
    for (let ligne = 0; ligne < NOMBRE_LIGNES; ligne++) {
      let ligneArray = [];
      for (let colonne = 0; colonne < NOMBRE_COLONNES; colonne++) {
        let diamant;
        do {
          diamant = Math.floor(Math.random() * 8);
        } while (
          (colonne >= 2 && diamant === ligneArray[colonne - 1] && diamant === ligneArray[colonne - 2]) ||
          (ligne >= 2 && diamant === grille[ligne - 1][colonne] && diamant === grille[ligne - 2][colonne])
        );
        ligneArray.push(diamant);
      }
      grille.push(ligneArray);
    }
    return grille;
  }
  
  // Ajoute des points et met à jour le niveau (nouveau niveau tous les 100 points)
  ajouterScore(points) {
    this.setState(prevState => {
      const nouveauScore = prevState.score + points;
      const nouveauNiveau = Math.floor(nouveauScore / 100) + 1;
      return { score: nouveauScore, niveau: nouveauNiveau };
    });
  }
  
  
  // Permute deux images et décrémente les essais si la permutation est invalide
echangerImages(ligne, colonne) {
  const { celluleSelectionnee, grille } = this.state;
  if (celluleSelectionnee) {
    const [lignePrecedente, colonnePrecedente] = celluleSelectionnee;
    if (
      (Math.abs(ligne - lignePrecedente) === 1 && colonne === colonnePrecedente) ||
      (Math.abs(colonne - colonnePrecedente) === 1 && ligne === lignePrecedente)
    ) {
      let nouvelleGrille = [...grille];
      let temporaire = nouvelleGrille[lignePrecedente][colonnePrecedente];
      nouvelleGrille[lignePrecedente][colonnePrecedente] = nouvelleGrille[ligne][colonne];
      nouvelleGrille[ligne][colonne] = temporaire;
      // Si un alignement est créé, on valide l'échange
      if (this.verifierAlignements(nouvelleGrille)) {
        this.setState({ grille: nouvelleGrille, celluleSelectionnee: null });
      } else {
        // Sinon, on annule l'échange et on décrémente les essais
        nouvelleGrille[ligne][colonne] = nouvelleGrille[lignePrecedente][colonnePrecedente];
        nouvelleGrille[lignePrecedente][colonnePrecedente] = temporaire;
        this.setState(prevState => {
          const nouveauxEssais = prevState.essais - 1;
          if (nouveauxEssais <= 0) {
            clearInterval(this.timer);
            alert("Game Over !");
          }
          return {
            celluleSelectionnee: null,
            essais: nouveauxEssais,
            grille: nouvelleGrille,
          };
        });
      }
    } else {
      this.setState({ celluleSelectionnee: [ligne, colonne] });
    }
  } else {
    this.setState({ celluleSelectionnee: [ligne, colonne] });
  }
}

  
  // Vérifie les alignements horizontaux et verticaux et met à jour le score
  verifierAlignements(grille) {
    let nouvelleGrille = [...grille];
    let alignementsTrouves = false;
    
    // Alignements horizontaux
    for (let ligne = 0; ligne < NOMBRE_LIGNES; ligne++) {
      for (let colonne = 0; colonne < NOMBRE_COLONNES - 2; colonne++) {
        let longueurAlignement = 1;
        while (
          colonne + longueurAlignement < NOMBRE_COLONNES &&
          nouvelleGrille[ligne][colonne] === nouvelleGrille[ligne][colonne + longueurAlignement]
        ) {
          longueurAlignement++;
        }
        if (longueurAlignement >= 3) {
          let pointsGagnes = 0;
          if (longueurAlignement === 3) {
            pointsGagnes = 50 * this.state.niveau;
          } else if (longueurAlignement === 4) {
            pointsGagnes = 150 * this.state.niveau;
          } else if (longueurAlignement >= 5) {
            pointsGagnes = 500 * this.state.niveau;
          }
          this.ajouterScore(pointsGagnes);
          for (let i = 0; i < longueurAlignement; i++) {
            nouvelleGrille[ligne][colonne + i] = null;
          }
          alignementsTrouves = true;
        }
      }
    }
    
    // Alignements verticaux
    for (let colonne = 0; colonne < NOMBRE_COLONNES; colonne++) {
      for (let ligne = 0; ligne < NOMBRE_LIGNES - 2; ligne++) {
        let longueurAlignement = 1;
        while (
          ligne + longueurAlignement < NOMBRE_LIGNES &&
          nouvelleGrille[ligne][colonne] === nouvelleGrille[ligne + longueurAlignement][colonne]
        ) {
          longueurAlignement++;
        }
        if (longueurAlignement >= 3) {
          let pointsGagnes = 0;
          if (longueurAlignement === 3) {
            pointsGagnes = 50 * this.state.niveau;
          } else if (longueurAlignement === 4) {
            pointsGagnes = 150 * this.state.niveau;
          } else if (longueurAlignement >= 5) {
            pointsGagnes = 500 * this.state.niveau;
          }
          this.ajouterScore(pointsGagnes);
          for (let i = 0; i < longueurAlignement; i++) {
            nouvelleGrille[ligne + i][colonne] = null;
          }
          alignementsTrouves = true;
        }
      }
    }
    
    if (alignementsTrouves) {
      // Faire tomber les images et compléter avec de nouveaux diamants
      for (let colonne = 0; colonne < NOMBRE_COLONNES; colonne++) {
        let nouvelleColonne = [];
        for (let ligne = 0; ligne < NOMBRE_LIGNES; ligne++) {
          if (nouvelleGrille[ligne][colonne] !== null) {
            nouvelleColonne.push(nouvelleGrille[ligne][colonne]);
          }
        }
        while (nouvelleColonne.length < NOMBRE_LIGNES) {
          nouvelleColonne.unshift(Math.floor(Math.random() * 8));
        }
        for (let ligne = 0; ligne < NOMBRE_LIGNES; ligne++) {
          nouvelleGrille[ligne][colonne] = nouvelleColonne[ligne];
        }
      }
      this.setState({ grille: nouvelleGrille });
    }
    
    return alignementsTrouves;
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
        <Text style={styles.info}>
          Score: {this.state.score} | Niveau: {this.state.niveau} | Essais: {this.state.essais}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: this.state.progression + "%" }]} />
        </View>
        {elementsGrille}
        {/* Conteneur pour les boutons en dessous de la grille */}
        <View style={styles.buttonsContainer}>
          <Button
            title={this.state.pause ? "Reprendre" : "Pause"}
            onPress={() => this.togglePause()}
          />
          <Button
            title="Recommencer"
            onPress={() => this.restartGame()}
          />
        </View>
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
  info: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  progressBarContainer: {
    width: 200,
    height: 20,
    borderColor: '#000',
    borderWidth: 1,
    backgroundColor: '#ccc',
    margin: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green',
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 200,
  },
});

export default Grille;
