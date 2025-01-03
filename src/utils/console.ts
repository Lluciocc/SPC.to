//yeah ik this file is not necessary...But its cool xd

const acsii_art = `                                                                       
                                         :=#@%*-.                                         
                                     .=*@@@@@@@@@%+-                                      
                                 .-*%@@@@@@@@@@@@@@@@#+:                                  
                              :+%@@@@@@@@@@@@@@@@@@@@@@@@#=:                              
                          :=#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*-.                          
                      .-*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%+:                       
                   -+%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#=:                   
               :+#@@@@@@@@@@@@@@@%#++=--::::..::::--=+*#%@@@@@@@@@@@@@@@*=.               
            -#@@@@@@@@@@@@@@%+-..:-=+**###%%%%%%###*++=-:.:=*%@@@@@@@@@@@@@%*.            
             :=#@@@@@@@@@@+:-*#@@@@@@@@@@@@@@@@@@@@@@@@@@@@#+--*@@@@@@@@@%*-.             
                .-*@@@@@@##@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*%@@@@@@%:                 
                    :+%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*- +#                  
                       .-@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#:    +#                  
                         %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*     #%.                 
                         %@@#+=--::..                ..::-=+*#@@*    =@@*                 
                         *@*-:.                            .:=%%=    :+*=                 
                           .-=+*####***++++++++++++**#####*+=-.      =@@%                 
                                     ...:::::::::...                 +@@%                 
                                                                     #@@%                 
                                                                     #=:.         `

export function console_message(){
    // trying to center the text in console bc its not possible
    const text = 'SPC.to';
    const width = 80;
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    console.log(' '.repeat(padding) + `%c${text}`, 'color:blue; font-weight: bold; background-color: yellow; font-size: 50px; text-align: center');
    console.log(`%c${acsii_art}`, 'color: purple');

    console.log("%cWelcome in the console section ! Please remind if you don't have any idea of where you are close this window.", 'color: red; font-weight: bold');
}