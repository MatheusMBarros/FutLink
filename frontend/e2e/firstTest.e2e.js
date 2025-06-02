describe("App inicial", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("deve abrir o app e mostrar botão de login", async () => {
    await expect(element(by.text("Entrar"))).toBeVisible(); // ajuste conforme seu texto real
  });
});
