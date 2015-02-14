namespace ConsumerPortal.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Booking",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        BookingNumber = c.String(),
                        FamilyName = c.String(),
                        GivenName = c.String(),
                        Email = c.String(),
                        Phone = c.String(),
                        VisitReason = c.String(),
                        Date = c.DateTime(nullable: false),
                        StartTime = c.Time(precision: 7),
                        EndTime = c.Time(precision: 7),
                        IsAM = c.Boolean(nullable: false),
                        ProviderId = c.Int(nullable: false),
                        Status = c.Int(nullable: false),
                        CreateOn = c.DateTime(nullable: false),
                        EntityStatus = c.Int(nullable: false),
                        Memo = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Provider", t => t.ProviderId, cascadeDelete: true)
                .Index(t => t.ProviderId);
            
            CreateTable(
                "dbo.Provider",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FamilyName = c.String(),
                        GivenName = c.String(),
                        Email = c.String(),
                        Phone = c.String(),
                        Mobile = c.String(),
                        CreateOn = c.DateTime(nullable: false),
                        EntityStatus = c.Int(nullable: false),
                        Memo = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ProviderWorkingTime",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ProviderId = c.Int(nullable: false),
                        Monday = c.Int(nullable: false),
                        Tuesday = c.Int(nullable: false),
                        Wednesday = c.Int(nullable: false),
                        Thursday = c.Int(nullable: false),
                        Friday = c.Int(nullable: false),
                        Saturday = c.Int(nullable: false),
                        Sunday = c.Int(nullable: false),
                        CreateOn = c.DateTime(nullable: false),
                        EntityStatus = c.Int(nullable: false),
                        Memo = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Provider", t => t.ProviderId, cascadeDelete: true)
                .Index(t => t.ProviderId);
            
            CreateTable(
                "dbo.Consumer",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FamilyName = c.String(),
                        GivenName = c.String(),
                        Email = c.String(),
                        Phone = c.String(),
                        CreateOn = c.DateTime(nullable: false),
                        EntityStatus = c.Int(nullable: false),
                        Memo = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UserProfile",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Email = c.String(),
                        Phone = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Booking", "ProviderId", "dbo.Provider");
            DropForeignKey("dbo.ProviderWorkingTime", "ProviderId", "dbo.Provider");
            DropIndex("dbo.ProviderWorkingTime", new[] { "ProviderId" });
            DropIndex("dbo.Booking", new[] { "ProviderId" });
            DropTable("dbo.UserProfile");
            DropTable("dbo.Consumer");
            DropTable("dbo.ProviderWorkingTime");
            DropTable("dbo.Provider");
            DropTable("dbo.Booking");
        }
    }
}
