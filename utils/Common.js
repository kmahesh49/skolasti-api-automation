import { ar } from "@faker-js/faker";
import { expect } from "@playwright/test";
    export const stringformat = (str, ...args) => 
        str.replace(/{(\d+)}/g, (match, index) => args[index].toString() || "");  
    