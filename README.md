# 4-uzduotis

## Verslo modelio ir logikos aprašymas
1. Įvadas
Pasirinktas verslo modelis realizuoja decentralizuotą bilietų pardavimo ir validavimo sistemą. Šios sistemos tikslas – užtikrinti skaidrų, patikimą ir nekintamą bilietų pardavimo procesą, pasitelkiant išmaniąją sutartį Ethereum tinkle. Sprendimas eliminuoja tarpininkus, padidina pasitikėjimą tarp dalyvių ir užtikrina, kad bilietų pirkimo bei patvirtinimo duomenys būtų vieši, tikslūs ir nekeičiami.
Sistema naudoja Ethereum išmaniąją sutartį (Smart Contract), sukurtą Solidity kalba, ir decentralizuotą aplikaciją (DApp), kuri leidžia vartotojams sąveikauti su kontraktu per patogią vartotojo sąsają.
 
2. Verslo modelio veikėjai
Organizatorius
Tai renginio savininkas, kuris:
- sukuria renginį,
- nurodo bilieto kainą ir bilietų kiekį,
- paskiria validatoriaus adresą,
- po renginio pasiima surinktas lėšas iš išmaniosios sutarties.
Organizatorius yra kontrakto diegėjas (contract owner).
 
Pirkėjas
Tai bet kuris vartotojas, norintis įsigyti bilietą.
Pirkėjas:
- prisijungia prie DApp per MetaMask,
- atlieka saugų bilieto pirkimą siųsdamas ETH į išmaniąją sutartį,
- gauna patvirtinimą, kad jam priklauso bilietas.
Pirkėjo bilieto turėjimas saugomas kontrakto būsenos kintamuosiuose.
 
Validatorius
Tai renginio darbuotojas, atsakingas už dalyvių bilietų tikrinimą prie įėjimo.
Validatorius:
- gauna specialias teises validuoti bilietus,
- pažymi bilietą kaip panaudotą,
- užtikrina, kad tas pats bilietas nebūtų panaudotas antrą kartą.
Validatoriaus adresą nurodo organizatorius kontrakto kūrimo metu.
