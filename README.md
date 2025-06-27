# CEP-WA2
A simple cell simulation where the user has the ability to control water, oxygen and glucose

In the setup page, the player is able to control water, oxygen and glucose spawning rates.
WATER:
1. Low: the water concentration of the cell is higher, resulting in net water flow out from the cell
2. Medium: the water concentration of the cell is equal to the water concentration of  the surroundings, resulting in no net water flow
3. High: the water concentration of the cell is lower, resulting in net water flow towards the cell
OXYGEN:
1. Low: oxygen spawns at a low and insufficient rate for the cell to survive
2. High: oxygen spawns at a high and sufficient rate for the cell to survive
GLUCOSE:
1. Low: glucose spawns at a low and insufficient rate for the cell to survive
2. High: glucose spawns at a high and sufficient rate for the cell to survive

FURTHER INSTRUCTIONS:
1. If the player were to choose low or high water rates, the cell will eventually die due to plasmolysis (lack of water) or cytolysis (cell bursting due to too much water), UNLESS it is a plant cell which is unable to die from cytolysis due to its cell wall
2. For the cell to survive energy-wise, the player must choose high rates for both oxygen and glucose. Either being selected as low will result in the cell's death due to a lack of energy
3. The simulation will end once the cell dies, either when water level reaches 60 (cytolysis for animal cells), when water level drops to 0 (plasmolysis) or when energy level drops to 0.
