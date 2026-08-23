---
title: "Adding Entity Types"
sidebar_position: 100
---


# Adding Entity Types (TypeScript)

The Meteor Admin SDK supports TypeScript typings for Contena entities. Adding entity types enables type-safe access, editing, and saving of entities when working with repositories.

To enable typings, create a global declaration file such as `global.d.ts` and extend the `EntitySchema` namespace.

## Option 1: Use Contena’s generated entity types (recommended)

Contena provides generated TypeScript definitions for all core entities.

Install the package that matches your Contena version:

```bash
npm install @contena/entity-schema-types@5.0.0
```

The package version corresponds to the Contena version without the leading `6.`. Examples:

`Contena 6.5.0.0` → `@contena/entity-schema-types@5.0.0`
`Contena 6.5.1.2` → `@contena/entity-schema-types@5.1.2`
`Contena 6.6.3.1` → `@contena/entity-schema-types@6.3.1`

Then import the types in your global declaration file:

```ts
// global.d.ts
import '@contena/entity-schema-types';
```

## Option 2: Use a fallback `any` type

This is the simplest solution, but it removes type safety. If strict typing isn't required, it's possible to define a fallback type for all entities by setting the type to `any`:

```ts
// global.d.ts
declare namespace EntitySchema {
    interface Entities {
        [entityName: string]: any;
    }
}
```

This avoids type errors but disables type safety.

## Option 3: Define custom entity types

This option provides full control by defining entity types manually for each property and association. The drawback is the additional effort required to maintain the definitions.

```ts
// global.d.ts
declare namespace EntitySchema {
    interface Entities {
        // using product_manufacturer as an example
        product_manufacturer: product_manufacturer;
        // in this case 'media', 'product' and 'product_manufacturer_translation' is also needed
        ...
    }

    interface product_manufacturer {
        id: string;
        versionId: string;
        mediaId?: string;
        link?: string;
        name: string;
        description?: string;
        customFields?: unknown;
        /* 
        * Entity and EntityCollection is defined in the namespace and can directly be used.
        * The value in the generic (here 'media', 'product' and 'product_manufacturer_translation') must
        * also be defined in this file.
        */ 
        media?: Entity<'media'>;
        products?: EntityCollection<'product'>;
        translations: EntityCollection<'product_manufacturer_translation'>;
        createdAt: string;
        updatedAt?: string;
        translated?: {name?: string, description?: string, customFields?: unknown};
    }

    ...
}
```

It is necessary to define types for any referenced entities, such as:

- `media`
- `product`
- `product_manufacturer_translation`
